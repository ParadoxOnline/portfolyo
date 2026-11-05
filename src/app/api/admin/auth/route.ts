import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  isAuthenticatedAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
} from "@/lib/rate-limiter";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  // Check common reverse proxy headers (Cloudflare, Vercel, standard X-Forwarded-For)
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Leftmost IP is the original client IP
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "127.0.0.1";
}

// Timing attack mitigation: ensure response always takes at least minDelayMs
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  const authenticated = await isAuthenticatedAdmin();
  const clientIp = getClientIp(req);
  const rateLimit = await checkRateLimit(clientIp);

  return NextResponse.json({
    authenticated,
    rateLimit: {
      allowed: rateLimit.allowed,
      waitSec: rateLimit.waitSec,
      totalFailures: rateLimit.totalFailures,
    },
  });
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIp(req);

  try {
    // 1. Check Rate Limit & Lockout Status
    const status = await checkRateLimit(clientIp);
    if (!status.allowed) {
      await sleep(Math.max(0, 300 - (Date.now() - startTime)));
      return NextResponse.json(
        {
          error: `Güvenlik Koruması (Bruteforce Kilitlendi): Çok fazla hatalı giriş denemesi yapıldı. Lütfen ${status.waitSec} saniye bekleyin.`,
          locked: true,
          waitSec: status.waitSec,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const password = String(body.password || "").trim();

    if (!password) {
      return NextResponse.json(
        { error: "Lütfen yönetici erişim anahtarını girin." },
        { status: 400 }
      );
    }

    // 2. Constant-time Password Verification
    const isCorrect = verifyAdminPassword(password);

    // Timing-attack prevention: simulate work to equalize response time
    const elapsed = Date.now() - startTime;
    if (elapsed < 350) {
      await sleep(350 - elapsed);
    }

    if (!isCorrect) {
      // Record failure and calculate progressive lock
      const outcome = await recordFailedAttempt(clientIp);
      
      let message = "Geçersiz yönetici anahtarı. Erişim reddedildi.";
      if (outcome.locked) {
        message = `Hatalı şifre denemesi (${outcome.failures}. deneme). Güvenlik nedeniyle erişiminiz ${outcome.waitSec} saniye kilitlendi.`;
      } else {
        const remaining = Math.max(1, 3 - outcome.failures);
        message = `Geçersiz yönetici anahtarı. (${outcome.failures} hatalı deneme. 3 denemeden sonra kilitlenecektir.)`;
      }

      return NextResponse.json(
        {
          error: message,
          locked: outcome.locked,
          waitSec: outcome.waitSec,
          failures: outcome.failures,
        },
        { status: outcome.locked ? 429 : 401 }
      );
    }

    // 3. Successful Login -> Clear IP Strike Record
    await resetFailedAttempts(clientIp);

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json(
      { error: "Giriş işlemi sırasında güvenlik katmanında bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ authenticated: false });
}

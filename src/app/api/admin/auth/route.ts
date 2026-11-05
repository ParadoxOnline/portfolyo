import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  isAuthenticatedAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

// Simple brute-force guard per IP
const failedAttempts = new Map<string, { count: number; lockUntil: number }>();

export async function GET() {
  const authenticated = await isAuthenticatedAdmin();
  return NextResponse.json({ authenticated });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const record = failedAttempts.get(ip);

    if (record && record.lockUntil > now) {
      const waitSec = Math.ceil((record.lockUntil - now) / 1000);
      return NextResponse.json(
        { error: `Çok fazla hatalı deneme. Lütfen ${waitSec} saniye bekleyin.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = String(body.password || "").trim();

    if (!password) {
      return NextResponse.json({ error: "Lütfen yönetici erişim anahtarını girin." }, { status: 400 });
    }

    if (!verifyAdminPassword(password)) {
      const current = failedAttempts.get(ip) || { count: 0, lockUntil: 0 };
      current.count += 1;
      if (current.count >= 5) {
        current.lockUntil = now + 60_000; // 1 min lock after 5 bad attempts
        current.count = 0;
      }
      failedAttempts.set(ip, current);

      return NextResponse.json(
        { error: "Geçersiz yönetici şifresi. Erişim reddedildi." },
        { status: 401 }
      );
    }

    failedAttempts.delete(ip);

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
    return NextResponse.json({ error: "Giriş işlemi sırasında bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ authenticated: false });
}

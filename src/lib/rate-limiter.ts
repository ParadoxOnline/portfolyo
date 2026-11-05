import fs from "node:fs/promises";
import path from "node:path";

interface IpAttemptRecord {
  failures: number; // total failures in current window
  lockUntil: number; // timestamp in ms until which IP is locked out
  lastAttemptAt: number;
  history: number[]; // timestamps of recent failed attempts
}

// In-memory cache for speed
const memoryStore = new Map<string, IpAttemptRecord>();

// Disk persistence fallback for local/stateful runtime
const STORE_DIR = path.join(process.cwd(), ".cache", "security");
const STORE_FILE = path.join(STORE_DIR, "auth_ratelimit.json");

let isDiskLoaded = false;

async function loadFromDisk() {
  if (isDiskLoaded) return;
  try {
    const data = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(data);
    const now = Date.now();
    for (const [ip, rec] of Object.entries(parsed as Record<string, IpAttemptRecord>)) {
      // only keep if not expired or recent
      if (rec.lockUntil > now || now - rec.lastAttemptAt < 24 * 60 * 60 * 1000) {
        memoryStore.set(ip, rec);
      }
    }
  } catch {
    // file doesn't exist yet, ok
  }
  isDiskLoaded = true;
}

async function persistToDisk() {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
    const obj: Record<string, IpAttemptRecord> = {};
    for (const [k, v] of memoryStore.entries()) {
      obj[k] = v;
    }
    await fs.writeFile(STORE_FILE, JSON.stringify(obj), "utf-8");
  } catch {
    // serverless/read-only env, in-memory works fine
  }
}

/**
 * Brute-force rules:
 * - 3 failures: 30 seconds cooldown
 * - 5 failures: 5 minutes lockout
 * - 8 failures: 30 minutes lockout
 * - 10+ failures: 2 hours lockout
 */
function calculateLockoutMs(failures: number): number {
  if (failures >= 10) return 2 * 60 * 60 * 1000; // 2 hours
  if (failures >= 8) return 30 * 60 * 1000; // 30 minutes
  if (failures >= 5) return 5 * 60 * 1000; // 5 minutes
  if (failures >= 3) return 30 * 1000; // 30 seconds
  return 0;
}

export interface RateLimitStatus {
  allowed: boolean;
  waitSec: number;
  remainingAttempts: number;
  totalFailures: number;
}

export async function checkRateLimit(clientIp: string): Promise<RateLimitStatus> {
  await loadFromDisk();
  const now = Date.now();
  const rec = memoryStore.get(clientIp);

  if (!rec) {
    return {
      allowed: true,
      waitSec: 0,
      remainingAttempts: 5,
      totalFailures: 0,
    };
  }

  // If locked out
  if (rec.lockUntil > now) {
    const waitSec = Math.ceil((rec.lockUntil - now) / 1000);
    return {
      allowed: false,
      waitSec,
      remainingAttempts: 0,
      totalFailures: rec.failures,
    };
  }

  // If lockout expired, reset if inactivity > 1 hour
  if (now - rec.lastAttemptAt > 60 * 60 * 1000) {
    memoryStore.delete(clientIp);
    persistToDisk().catch(() => {});
    return {
      allowed: true,
      waitSec: 0,
      remainingAttempts: 5,
      totalFailures: 0,
    };
  }

  const remaining = Math.max(0, 5 - (rec.failures % 5));
  return {
    allowed: true,
    waitSec: 0,
    remainingAttempts: remaining === 0 ? 1 : remaining,
    totalFailures: rec.failures,
  };
}

export async function recordFailedAttempt(clientIp: string): Promise<{
  locked: boolean;
  waitSec: number;
  failures: number;
}> {
  await loadFromDisk();
  const now = Date.now();
  const rec = memoryStore.get(clientIp) || {
    failures: 0,
    lockUntil: 0,
    lastAttemptAt: now,
    history: [],
  };

  rec.failures += 1;
  rec.lastAttemptAt = now;
  rec.history.push(now);

  // Keep last 20 timestamps
  if (rec.history.length > 20) {
    rec.history.shift();
  }

  const lockDuration = calculateLockoutMs(rec.failures);
  if (lockDuration > 0) {
    rec.lockUntil = now + lockDuration;
  }

  memoryStore.set(clientIp, rec);
  persistToDisk().catch(() => {});

  const waitSec = Math.ceil(lockDuration / 1000);
  return {
    locked: lockDuration > 0,
    waitSec,
    failures: rec.failures,
  };
}

export async function resetFailedAttempts(clientIp: string): Promise<void> {
  await loadFromDisk();
  if (memoryStore.has(clientIp)) {
    memoryStore.delete(clientIp);
    persistToDisk().catch(() => {});
  }
}

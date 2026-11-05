import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { EmployerCompany, INITIAL_EMPLOYER_COMPANIES } from "@/data/employer-seed";

export const runtime = "nodejs";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "employer-discovery.json");

async function readCompaniesFromDisk(): Promise<EmployerCompany[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // File doesn't exist yet or serverless environment
  }
  return INITIAL_EMPLOYER_COMPANIES;
}

async function writeCompaniesToDisk(companies: EmployerCompany[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(companies, null, 2), "utf8");
    return true;
  } catch {
    // In read-only serverless environments (like Vercel), disk write fails gracefully
    return false;
  }
}

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const companies = await readCompaniesFromDisk();
  return NextResponse.json({ companies });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const companies = body.companies as EmployerCompany[];
    if (!Array.isArray(companies)) {
      return NextResponse.json({ error: "Geçersiz veri formatı." }, { status: 400 });
    }

    const persistedOnDisk = await writeCompaniesToDisk(companies);
    return NextResponse.json({ ok: true, persistedOnDisk, count: companies.length });
  } catch {
    return NextResponse.json({ error: "Kayıt sırasında hata oluştu." }, { status: 500 });
  }
}

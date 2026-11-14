import { NextResponse } from "next/server";
import { serialFor, verifyLicense } from "@/lib/license";

export async function POST(req: Request) {
  const { key } = await req.json().catch(() => ({ key: "" }));
  const p = typeof key === "string" ? verifyLicense(key) : null;
  if (!p) return NextResponse.json({ valid: false });
  return NextResponse.json({
    valid: true,
    license: { key: key.trim(), serial: serialFor(key.trim()), slug: p.p, email: p.e, order: p.o, issued: p.t, demo: !!p.d },
  });
}

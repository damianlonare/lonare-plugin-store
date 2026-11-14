import { NextResponse } from "next/server";
import { verifyLicense } from "@/lib/license";
import { getPlugin } from "@/lib/plugins";

const EXT = { mac: "pkg", win: "exe", linux: "tar.gz" } as const;

/**
 * Installer downloads are gated by a valid license key.
 * Set INSTALLER_BASE_URL (e.g. a private R2/S3 bucket behind a CDN) and upload files named
 *   <slug>-<os>.<ext>   e.g. aetherial-reverb-mac.pkg
 * For real protection, swap the redirect for a short-lived signed URL from your storage provider.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const os = url.searchParams.get("os") as keyof typeof EXT | null;
  const lic = verifyLicense(url.searchParams.get("key") ?? "");
  if (!lic || !os || !(os in EXT)) return NextResponse.json({ error: "Licencia o sistema inválido." }, { status: 403 });
  const plugin = getPlugin(lic.p);
  if (!plugin) return NextResponse.json({ error: "Plugin no encontrado." }, { status: 404 });

  const file = `${plugin.slug}-${os}.${EXT[os]}`;
  if (process.env.INSTALLER_BASE_URL && !lic.d) {
    return NextResponse.redirect(`${process.env.INSTALLER_BASE_URL.replace(/\/$/, "")}/${file}`);
  }
  const note = `${plugin.name} v${plugin.version}\n\nArchivo de muestra: aquí se descargaría ${file}.\nConfigura INSTALLER_BASE_URL para entregar los instaladores reales.\n`;
  return new NextResponse(note, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Content-Disposition": `attachment; filename="${plugin.slug}-${os}-LEEME.txt"` },
  });
}

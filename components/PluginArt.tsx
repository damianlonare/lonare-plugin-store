import type { Plugin } from "@/lib/plugins";

/** Generated "hardware faceplate" cover so every plugin has art until you add real screenshots. */
export default function PluginArt({ plugin, large = false }: { plugin: Plugin; large?: boolean }) {
  let seed = [...plugin.slug].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const accent = `hsl(${plugin.hue} 58% 56%)`;
  const knobs = Array.from({ length: 4 }, () => rnd());
  const bars = Array.from({ length: 36 }, () => 0.15 + rnd() * 0.85);
  return (
    <svg viewBox="0 0 400 260" className="block h-auto w-full bg-[#141414]" role="img" aria-label={`Interfaz de ${plugin.name}`}>
      <rect x="0.5" y="0.5" width="399" height="259" fill="none" stroke="#2a2a2a" />
      <text x="20" y="32" fill="#f4f4f6" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="15" letterSpacing="-0.3">
        {plugin.name.toUpperCase()}
      </text>
      <text x="380" y="32" textAnchor="end" fill="#828282" fontFamily="Space Grotesk, sans-serif" fontSize="9" letterSpacing="1.2">
        V{plugin.version}
      </text>
      <line x1="20" y1="46" x2="380" y2="46" stroke="#2a2a2a" />
      {bars.map((h, i) => (
        <rect key={i} x={20 + i * 10} y={130 - h * 70} width="6" height={h * 70}
          fill={i % 9 === 4 ? accent : "#3a3a3a"} />
      ))}
      <line x1="20" y1="140" x2="380" y2="140" stroke="#2a2a2a" />
      {knobs.map((v, i) => {
        const cx = 65 + i * 90, cy = 196, r = large ? 24 : 22;
        const a = (-225 + v * 270) * (Math.PI / 180);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#1e1e1e" stroke="#444" />
            <line x1={cx} y1={cy} x2={cx + Math.cos(a) * (r - 4)} y2={cy + Math.sin(a) * (r - 4)}
              stroke={i === 1 ? accent : "#f4f4f6"} strokeWidth="2.5" />
            <text x={cx} y={cy + r + 16} textAnchor="middle" fill="#828282" fontFamily="Space Grotesk, sans-serif" fontSize="8" letterSpacing="1">
              {["INPUT", "DRIVE", "TONE", "MIX"][i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

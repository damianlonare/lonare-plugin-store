import { DEMO_MODE } from "@/lib/config";

/** Thin strip on top of every page while the store runs in demo mode.
 *  Turn it off by setting NEXT_PUBLIC_DEMO_MODE=false. */
export default function DemoBar() {
  if (!DEMO_MODE) return null;
  return (
    <div role="status" className="bg-ink text-white">
      <div className="wrap flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
        <span className="label inline-flex items-center gap-2 text-coral-hover">
          <span className="inline-block h-1.5 w-1.5 bg-coral" aria-hidden /> Modo demo
        </span>
        <span className="text-[13px] leading-5 text-white/80">
          Esta tienda es una demo: no se cobra nada y las licencias son de prueba.
        </span>
      </div>
    </div>
  );
}

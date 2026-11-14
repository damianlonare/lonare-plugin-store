// Catalog. These are placeholder plugins taken from the Stitch mockups —
// replace names, copy and prices with your real plugins.

export type Format = "VST3" | "AU" | "CLAP" | "AAX";
export type Platform = "macOS" | "Windows" | "Linux";

export type Plugin = {
  slug: string;
  name: string;
  version: string;
  category: "Reverb" | "Saturación" | "Dinámica" | "Modulación" | "Graves";
  tagline: string;
  description: string;
  features: string[];
  price: number; // USD
  formats: Format[];
  platforms: Platform[];
  latency: string;
  featured?: boolean;
  isNew?: boolean;
  hue: number; // drives the generated cover art
};

export const BRAND = {
  name: "Lonare Audio",
  short: "LNR",
  tagline: "Plugins de audio hechos por un productor, para productores.",
  author: "Damian Lonare",
  city: "Monterrey, MX",
};

export const BUNDLE = { minItems: 3, discount: 0.2 };

export const PLUGINS: Plugin[] = [
  {
    slug: "aetherial-reverb",
    name: "Aetherial Reverb MkII",
    version: "2.4.1",
    category: "Reverb",
    tagline: "Reverb algorítmica de doble matriz para espacios enormes que no ensucian la mezcla.",
    description:
      "Dos motores de reverb en paralelo: uno para la cola larga y otro para las primeras reflexiones. Ponle la reverb a la voz sin que se coma el resto de la mezcla, con el ducking integrado y un filtro de color que funciona como en una consola.",
    features: [
      "Doble matriz de difusión (cola + reflexiones)",
      "Ducking integrado con detector sidechain",
      "Modo Freeze para pads y transiciones",
      "48 presets hechos para voz, synths y batería",
    ],
    price: 49,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows"],
    latency: "0 ms",
    featured: true,
    hue: 8,
  },
  {
    slug: "vortex-saturator",
    name: "Vortex Saturator MkI",
    version: "1.2.0",
    category: "Saturación",
    tagline: "Saturación de bulbo y transformador con oversampling de fase lineal.",
    description:
      "Tres etapas de saturación que puedes mezclar: bulbo, transformador y cinta. Calienta un bus de batería, dale cuerpo a un bajo o ensucia una voz sin perder definición en los agudos gracias al oversampling 4x.",
    features: [
      "3 etapas: bulbo, transformador y cinta",
      "Oversampling 4x de fase lineal",
      "Control de mezcla wet/dry y auto-gain",
      "Medidor de armónicos en tiempo real",
    ],
    price: 39,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows", "Linux"],
    latency: "< 1.1 ms",
    featured: true,
    hue: 352,
  },
  {
    slug: "warmtape",
    name: "WarmTape Saturation v2",
    version: "2.0.3",
    category: "Saturación",
    tagline: "Cinta de media pulgada: wow, flutter y compresión suave.",
    description:
      "Emula una grabadora de cinta con wow y flutter ajustables, ruido opcional y compresión de cinta. Ideal para lo-fi, demos que suenan a disco viejo y para pegar un mix.",
    features: ["Wow y flutter independientes", "3 velocidades de cinta", "Ruido de cinta opcional", "Modo lo-fi"],
    price: 39,
    formats: ["VST3", "AU"],
    platforms: ["macOS", "Windows"],
    latency: "0 ms",
    hue: 28,
  },
  {
    slug: "phaseshift-shaper",
    name: "PhaseShift Shaper",
    version: "1.0.0",
    category: "Modulación",
    tagline: "Phaser y shaper de fase sincronizado al tempo.",
    description:
      "Un phaser de 12 etapas con un LFO dibujable y sincronizado al BPM de tu DAW. Desde barridos lentos hasta movimientos rítmicos para synths y guitarras.",
    features: ["12 etapas de all-pass", "LFO dibujable sincronizado", "Modo estéreo ancho", "Retroalimentación con saturación"],
    price: 29,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows", "Linux"],
    latency: "0 ms",
    isNew: true,
    hue: 200,
  },
  {
    slug: "optical-tube",
    name: "Optical Tube Compressor",
    version: "1.1.2",
    category: "Dinámica",
    tagline: "Compresor óptico de bulbo para voces suaves y al frente.",
    description:
      "Un compresor óptico con la respuesta lenta y musical de los clásicos. Sube una voz al frente sin que se note la compresión.",
    features: ["Respuesta óptica program-dependent", "Etapa de bulbo opcional", "Sidechain HPF", "Medidor de reducción de ganancia"],
    price: 49,
    formats: ["VST3", "AU", "AAX"],
    platforms: ["macOS", "Windows"],
    latency: "0 ms",
    hue: 160,
  },
  {
    slug: "subharmonic-exciter",
    name: "Subharmonic Exciter",
    version: "1.1.0",
    category: "Graves",
    tagline: "Genera subarmónicos para que el bajo se sienta en bocinas pequeñas.",
    description:
      "Crea una octava abajo y armónicos arriba del fundamental para que tus graves se escuchen igual en audífonos, celulares y subwoofers.",
    features: ["Generador de octava inferior", "Excitador de armónicos superiores", "Crossover ajustable", "Modo mono para graves"],
    price: 29,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows"],
    latency: "0 ms",
    hue: 265,
  },
  {
    slug: "transient-sculptor",
    name: "Transient Sculptor Pro",
    version: "1.0.4",
    category: "Dinámica",
    tagline: "Moldea el ataque y la cola de cada golpe.",
    description:
      "Control de ataque y sustain independiente del nivel. Haz que una bombo pegue más o que una caja suene más cerrada sin tocar un compresor.",
    features: ["Ataque y sustain independientes", "Detector por bandas", "Limitador de salida", "Modo M/S"],
    price: 49,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows", "Linux"],
    latency: "0 ms",
    isNew: true,
    hue: 40,
  },
];

export function getPlugin(slug: string) {
  return PLUGINS.find((p) => p.slug === slug);
}

export const CATEGORIES = Array.from(new Set(PLUGINS.map((p) => p.category)));

/** Cart pricing — used by both the cart UI and the checkout API so they always match. */
export function priceCart(slugs: string[]) {
  const items = slugs.map(getPlugin).filter(Boolean) as Plugin[];
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const bundle = items.length >= BUNDLE.minItems;
  const discount = bundle ? Math.round(subtotal * BUNDLE.discount * 100) / 100 : 0;
  return {
    items,
    subtotal,
    bundle,
    discount,
    total: Math.round((subtotal - discount) * 100) / 100,
    unitFactor: bundle ? 1 - BUNDLE.discount : 1,
  };
}

export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} USD`;

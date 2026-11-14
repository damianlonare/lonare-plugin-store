// Catalog. These are placeholder plugins taken from the Stitch mockups —
// replace names, copy and prices with your real plugins.
import type { Lang } from "./i18n";

export type Format = "VST3" | "AU" | "CLAP" | "AAX";
export type Platform = "macOS" | "Windows" | "Linux";
export type Category = "reverb" | "saturation" | "dynamics" | "modulation" | "bass";

type L = Record<Lang, string>;
type LL = Record<Lang, string[]>;

type PluginData = {
  slug: string;
  name: string;
  version: string;
  category: Category;
  tagline: L;
  description: L;
  features: LL;
  price: number; // USD
  formats: Format[];
  platforms: Platform[];
  latency: string;
  featured?: boolean;
  isNew?: boolean;
  hue: number; // drives the generated cover art
};

/** A plugin with its text already resolved to one language. */
export type Plugin = Omit<PluginData, "tagline" | "description" | "features"> & {
  tagline: string;
  description: string;
  features: string[];
};

export const CATEGORY_LABEL: Record<Category, L> = {
  reverb: { es: "Reverb", en: "Reverb" },
  saturation: { es: "Saturación", en: "Saturation" },
  dynamics: { es: "Dinámica", en: "Dynamics" },
  modulation: { es: "Modulación", en: "Modulation" },
  bass: { es: "Graves", en: "Bass" },
};

export const BRAND = {
  name: "Lonare Audio",
  author: "Damian Lonare",
  city: { es: "Monterrey, MX", en: "Monterrey, Mexico" } as L,
  tagline: {
    es: "Plugins de audio hechos por un productor, para productores.",
    en: "Audio plugins made by a producer, for producers.",
  } as L,
};

export const BUNDLE = { minItems: 3, discount: 0.2 };

const DATA: PluginData[] = [
  {
    slug: "aetherial-reverb",
    name: "Aetherial Reverb MkII",
    version: "2.4.1",
    category: "reverb",
    tagline: {
      es: "Reverb algorítmica de doble matriz para espacios enormes que no ensucian la mezcla.",
      en: "Dual-matrix algorithmic reverb for huge spaces that don't muddy the mix.",
    },
    description: {
      es: "Dos motores de reverb en paralelo: uno para la cola larga y otro para las primeras reflexiones. Ponle la reverb a la voz sin que se coma el resto de la mezcla, con el ducking integrado y un filtro de color que funciona como en una consola.",
      en: "Two reverb engines in parallel: one for the long tail and one for the early reflections. Put reverb on a vocal without it swallowing the rest of the mix, thanks to built-in ducking and a console-style color filter.",
    },
    features: {
      es: ["Doble matriz de difusión (cola + reflexiones)", "Ducking integrado con detector sidechain", "Modo Freeze para pads y transiciones", "48 presets hechos para voz, synths y batería"],
      en: ["Dual diffusion matrix (tail + reflections)", "Built-in ducking with a sidechain detector", "Freeze mode for pads and transitions", "48 presets for vocals, synths and drums"],
    },
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
    category: "saturation",
    tagline: {
      es: "Saturación de bulbo y transformador con oversampling de fase lineal.",
      en: "Tube and transformer saturation with linear-phase oversampling.",
    },
    description: {
      es: "Tres etapas de saturación que puedes mezclar: bulbo, transformador y cinta. Calienta un bus de batería, dale cuerpo a un bajo o ensucia una voz sin perder definición en los agudos gracias al oversampling 4x.",
      en: "Three saturation stages you can blend: tube, transformer and tape. Warm up a drum bus, add body to a bass or dirty up a vocal without losing high-end definition, thanks to 4x oversampling.",
    },
    features: {
      es: ["3 etapas: bulbo, transformador y cinta", "Oversampling 4x de fase lineal", "Control de mezcla wet/dry y auto-gain", "Medidor de armónicos en tiempo real"],
      en: ["3 stages: tube, transformer and tape", "4x linear-phase oversampling", "Wet/dry mix and auto-gain", "Real-time harmonics meter"],
    },
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
    category: "saturation",
    tagline: {
      es: "Cinta de media pulgada: wow, flutter y compresión suave.",
      en: "Half-inch tape: wow, flutter and gentle compression.",
    },
    description: {
      es: "Emula una grabadora de cinta con wow y flutter ajustables, ruido opcional y compresión de cinta. Ideal para lo-fi, demos que suenan a disco viejo y para pegar un mix.",
      en: "Emulates a tape machine with adjustable wow and flutter, optional noise and tape compression. Great for lo-fi, demos that sound like an old record, and gluing a mix together.",
    },
    features: {
      es: ["Wow y flutter independientes", "3 velocidades de cinta", "Ruido de cinta opcional", "Modo lo-fi"],
      en: ["Independent wow and flutter", "3 tape speeds", "Optional tape noise", "Lo-fi mode"],
    },
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
    category: "modulation",
    tagline: {
      es: "Phaser y shaper de fase sincronizado al tempo.",
      en: "Tempo-synced phaser and phase shaper.",
    },
    description: {
      es: "Un phaser de 12 etapas con un LFO dibujable y sincronizado al BPM de tu DAW. Desde barridos lentos hasta movimientos rítmicos para synths y guitarras.",
      en: "A 12-stage phaser with a drawable LFO synced to your DAW's BPM. From slow sweeps to rhythmic movement for synths and guitars.",
    },
    features: {
      es: ["12 etapas de all-pass", "LFO dibujable sincronizado", "Modo estéreo ancho", "Retroalimentación con saturación"],
      en: ["12 all-pass stages", "Drawable, synced LFO", "Wide stereo mode", "Feedback with saturation"],
    },
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
    category: "dynamics",
    tagline: {
      es: "Compresor óptico de bulbo para voces suaves y al frente.",
      en: "Optical tube compressor for smooth, upfront vocals.",
    },
    description: {
      es: "Un compresor óptico con la respuesta lenta y musical de los clásicos. Sube una voz al frente sin que se note la compresión.",
      en: "An optical compressor with the slow, musical response of the classics. Bring a vocal forward without hearing the compression.",
    },
    features: {
      es: ["Respuesta óptica program-dependent", "Etapa de bulbo opcional", "Sidechain HPF", "Medidor de reducción de ganancia"],
      en: ["Program-dependent optical response", "Optional tube stage", "Sidechain HPF", "Gain-reduction meter"],
    },
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
    category: "bass",
    tagline: {
      es: "Genera subarmónicos para que el bajo se sienta en bocinas pequeñas.",
      en: "Generates subharmonics so the bass comes through on small speakers.",
    },
    description: {
      es: "Crea una octava abajo y armónicos arriba del fundamental para que tus graves se escuchen igual en audífonos, celulares y subwoofers.",
      en: "Creates an octave below and harmonics above the fundamental so your low end translates on headphones, phones and subwoofers alike.",
    },
    features: {
      es: ["Generador de octava inferior", "Excitador de armónicos superiores", "Crossover ajustable", "Modo mono para graves"],
      en: ["Sub-octave generator", "Upper-harmonics exciter", "Adjustable crossover", "Mono-bass mode"],
    },
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
    category: "dynamics",
    tagline: {
      es: "Moldea el ataque y la cola de cada golpe.",
      en: "Shape the attack and tail of every hit.",
    },
    description: {
      es: "Control de ataque y sustain independiente del nivel. Haz que un bombo pegue más o que una caja suene más cerrada sin tocar un compresor.",
      en: "Level-independent attack and sustain control. Make a kick punch harder or a snare sound tighter without touching a compressor.",
    },
    features: {
      es: ["Ataque y sustain independientes", "Detector por bandas", "Limitador de salida", "Modo M/S"],
      en: ["Independent attack and sustain", "Multiband detector", "Output limiter", "M/S mode"],
    },
    price: 49,
    formats: ["VST3", "AU", "CLAP"],
    platforms: ["macOS", "Windows", "Linux"],
    latency: "0 ms",
    isNew: true,
    hue: 40,
  },
];

const resolve = (p: PluginData, lang: Lang): Plugin => ({
  ...p,
  tagline: p.tagline[lang],
  description: p.description[lang],
  features: p.features[lang],
});

export function getPlugins(lang: Lang): Plugin[] {
  return DATA.map((p) => resolve(p, lang));
}

export function getPlugin(slug: string, lang: Lang = "es"): Plugin | undefined {
  const p = DATA.find((x) => x.slug === slug);
  return p && resolve(p, lang);
}

export const SLUGS = DATA.map((p) => p.slug);
export const CATEGORIES = Array.from(new Set(DATA.map((p) => p.category)));

/** Cart pricing — used by both the cart UI and the checkout API so they always match. */
export function priceCart(slugs: string[], lang: Lang = "es") {
  const items = slugs.map((s) => getPlugin(s, lang)).filter(Boolean) as Plugin[];
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

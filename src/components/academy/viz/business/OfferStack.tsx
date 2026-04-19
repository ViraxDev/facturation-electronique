import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, Settings2, LifeBuoy } from "lucide-react";

type Layer = {
  key: string;
  title: string;
  subtitle: string;
  bullets: string[];
  price: string;
  icon: React.ReactNode;
  from: string;
  to: string;
};

const LAYERS: Layer[] = [
  {
    key: "onboarding",
    title: "Audit & onboarding",
    subtitle: "Semaines 1-2",
    bullets: ["Fiche d'audit client", "Cartographie cabinet", "Choix PA argumenté"],
    price: "500 - 1 500 €",
    icon: <ClipboardCheck className="h-5 w-5" aria-hidden="true" />,
    from: "from-amber-300",
    to: "to-amber-500",
  },
  {
    key: "setup",
    title: "Setup & formation",
    subtitle: "Semaines 3-6",
    bullets: ["Paramétrage PA", "Tests bout-en-bout", "Formation 2h + doc"],
    price: "forfait inclus",
    icon: <Settings2 className="h-5 w-5" aria-hidden="true" />,
    from: "from-amber-400",
    to: "to-orange-500",
  },
  {
    key: "recurring",
    title: "Suivi récurrent",
    subtitle: "T+30 / T+60 / T+90, puis mensuel",
    bullets: ["Hotline 3 mois", "Bilan + certificat", "Abonnement 40-75 €/mois"],
    price: "40 - 75 €/mois",
    icon: <LifeBuoy className="h-5 w-5" aria-hidden="true" />,
    from: "from-orange-500",
    to: "to-amber-700",
  },
];

export default function OfferStack() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div
      className="not-prose my-6 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-amber-50/50 to-white p-6 shadow-sm"
      aria-label="Offre packagée en trois couches"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0369A1]">
          Offre packagée TPE-PME
        </h3>
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
          Trois couches empilées : audit, setup, récurrent. Survolez pour isoler une couche.
        </p>
      </div>

      <div
        className="relative mx-auto flex h-[320px] w-full max-w-[520px] items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            transform: reduce ? "none" : "rotateX(32deg) rotateZ(-8deg)",
          }}
        >
          {LAYERS.map((layer, i) => {
            const isActive = hover === i;
            const isDimmed = hover !== null && hover !== i;
            const baseZ = (LAYERS.length - 1 - i) * 46;
            return (
              <motion.div
                key={layer.key}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                role="button"
                aria-label={`Couche ${layer.title}`}
                initial={false}
                animate={{
                  z: isActive ? baseZ + 40 : baseZ,
                  opacity: isDimmed ? 0.35 : 1,
                  scale: isActive ? 1.03 : 1,
                }}
                transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-2xl p-[1.5px] outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                style={{
                  transformStyle: "preserve-3d",
                  top: `calc(50% + ${(i - 1) * 38}px)`,
                }}
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br ${layer.from} ${layer.to} p-[1px] shadow-xl`}
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${layer.from} ${layer.to} text-white shadow-md`}
                      aria-hidden="true"
                    >
                      {layer.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-[#0F172A]">
                          {layer.title}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-amber-700">
                          {layer.price}
                        </span>
                      </div>
                      <div className="truncate text-[11px] text-[var(--color-muted-foreground)]">
                        {layer.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <div
            key={layer.key}
            className={`rounded-xl border p-3 transition-colors ${
              hover === i ? "border-amber-500 bg-amber-50" : "border-[var(--color-border)] bg-white"
            }`}
          >
            <div className="flex items-center gap-2 text-[#0369A1]">
              {layer.icon}
              <span className="text-xs font-semibold uppercase tracking-wide">{layer.title}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {layer.bullets.map((b) => (
                <li key={b} className="text-xs text-[var(--color-muted-foreground)]">
                  — {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

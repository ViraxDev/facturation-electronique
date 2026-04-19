import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { TrendingDown, Zap, FileText } from "lucide-react";

type Stat = {
  icon: React.ReactNode;
  label: string;
  from: number;
  to: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  sub: string;
};

const STATS: Stat[] = [
  {
    icon: <TrendingDown className="h-5 w-5" aria-hidden="true" />,
    label: "Écart de TVA annuel",
    from: 0,
    to: 15,
    suffix: " Md€",
    sub: "12 à 15 Md€ d'écart estimé chaque année",
  },
  {
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    label: "Gains de productivité attendus",
    from: 0,
    to: 4.5,
    suffix: " Md€",
    decimals: 1,
    sub: "Estimation cumulée secteur privé",
  },
  {
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    label: "Coût moyen d'une facture papier",
    from: 2,
    to: 15,
    prefix: "",
    suffix: " €",
    sub: "Ramené à moins de 2 € en Factur-X",
  },
];

function Counter({ stat, active }: { stat: Stat; active: boolean }) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? stat.to : stat.from);
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setVal(stat.to);
      return;
    }
    const controls = animate(stat.from, stat.to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [active, reduce, stat.from, stat.to]);

  const display = (stat.decimals ? val.toFixed(stat.decimals) : Math.round(val).toString()).replace(".", ",");

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[#0369A1]">
        {stat.icon}
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
          {stat.label}
        </span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-[var(--color-primary)] tabular-nums">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{stat.sub}</p>
    </div>
  );
}

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="not-prose my-6 grid gap-3 sm:grid-cols-3"
      aria-label="Chiffres clés de la réforme"
    >
      {STATS.map((s) => (
        <Counter key={s.label} stat={s} active={inView} />
      ))}
    </motion.div>
  );
}

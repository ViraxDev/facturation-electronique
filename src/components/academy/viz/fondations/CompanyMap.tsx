import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, Factory, Store, User } from "lucide-react";

type Cat = {
  id: string;
  short: string;
  name: string;
  icon: React.ReactNode;
  effectifs: string;
  reception: string;
  emission: string;
};

const CATS: Cat[] = [
  {
    id: "ge",
    short: "GE",
    name: "Grande entreprise",
    icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
    effectifs: "+ 5 000 salariés",
    reception: "1er sept. 2026",
    emission: "1er sept. 2026",
  },
  {
    id: "eti",
    short: "ETI",
    name: "Entreprise de taille intermédiaire",
    icon: <Factory className="h-5 w-5" aria-hidden="true" />,
    effectifs: "250 à 4 999 salariés",
    reception: "1er sept. 2026",
    emission: "1er sept. 2026",
  },
  {
    id: "pme",
    short: "PME",
    name: "Petite et moyenne entreprise",
    icon: <Store className="h-5 w-5" aria-hidden="true" />,
    effectifs: "< 250 salariés",
    reception: "1er sept. 2026",
    emission: "1er sept. 2027",
  },
  {
    id: "tpe",
    short: "TPE / micro",
    name: "Très petite entreprise et micro-entrepreneur",
    icon: <User className="h-5 w-5" aria-hidden="true" />,
    effectifs: "< 10 salariés",
    reception: "1er sept. 2026",
    emission: "1er sept. 2027",
  },
];

export default function CompanyMap() {
  const [active, setActive] = useState<string>("pme");
  const reduce = useReducedMotion();
  const current = CATS.find((c) => c.id === active)!;

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Qui est concerné ? Cliquez une catégorie
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        {CATS.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              aria-pressed={isActive}
              className={`group rounded-lg border p-3 text-left transition ${
                isActive
                  ? "border-[#0369A1] bg-[#0369A1]/5 shadow-sm"
                  : "border-[var(--color-border)] hover:border-[#0369A1]/50"
              }`}
              style={reduce ? undefined : { perspective: 600 }}
            >
              <motion.div
                animate={{ rotateY: isActive ? 0 : 0, scale: isActive ? 1.02 : 1 }}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="flex items-center gap-2 text-[#0369A1]">
                  {c.icon}
                  <span className="text-sm font-semibold text-[var(--color-primary)]">{c.short}</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-muted-foreground)]">{c.effectifs}</p>
              </motion.div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 grid gap-3 rounded-lg border border-[#0369A1]/20 bg-[#0369A1]/5 p-4 sm:grid-cols-3"
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Catégorie
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">{current.name}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Réception
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0369A1]">{current.reception}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Émission
          </p>
          <p className="mt-1 text-sm font-semibold text-[#0369A1]">{current.emission}</p>
        </div>
      </motion.div>
    </div>
  );
}

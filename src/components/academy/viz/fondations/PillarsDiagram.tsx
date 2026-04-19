import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Receipt, Radio, CreditCard } from "lucide-react";

type Pillar = {
  id: string;
  icon: React.ReactNode;
  title: string;
  scope: string;
  detail: string;
};

const PILLARS: Pillar[] = [
  {
    id: "einv",
    icon: <Receipt className="h-5 w-5" aria-hidden="true" />,
    title: "E-invoicing",
    scope: "B2B domestique",
    detail:
      "Émission et réception des factures entre entreprises françaises assujetties à la TVA, au format structuré (Factur-X, UBL 2.1, UN/CEFACT CII) conforme à EN 16931.",
  },
  {
    id: "erep-tx",
    icon: <Radio className="h-5 w-5" aria-hidden="true" />,
    title: "E-reporting transactions",
    scope: "B2C + international",
    detail:
      "Transmission à la DGFiP des données qui sortent du B2B domestique : ventes aux particuliers, opérations intracommunautaires et exports.",
  },
  {
    id: "erep-pay",
    icon: <CreditCard className="h-5 w-5" aria-hidden="true" />,
    title: "E-reporting paiement",
    scope: "Prestations de services",
    detail:
      "Pour les services, transmission des données d'encaissement qui conditionnent l'exigibilité de la TVA.",
  },
];

export default function PillarsDiagram() {
  const [active, setActive] = useState<string>(PILLARS[0].id);
  const reduce = useReducedMotion();
  const current = PILLARS.find((p) => p.id === active)!;

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Les trois piliers techniques
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Piliers">
        {PILLARS.map((p) => {
          const isActive = p.id === active;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(p.id)}
              onMouseEnter={() => setActive(p.id)}
              className={`relative overflow-hidden rounded-lg border p-3 text-left transition ${
                isActive
                  ? "border-[#0369A1] bg-[#0369A1]/5"
                  : "border-[var(--color-border)] hover:border-[#0369A1]/50"
              }`}
            >
              <div className="flex items-center gap-2 text-[#0369A1]">
                {p.icon}
                <span className="text-sm font-semibold text-[var(--color-primary)]">{p.title}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{p.scope}</p>
              {isActive && !reduce && (
                <motion.span
                  layoutId="pillar-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0369A1]"
                />
              )}
            </button>
          );
        })}
      </div>
      <motion.p
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-sm text-[var(--color-primary)]"
      >
        {current.detail}
      </motion.p>
    </div>
  );
}

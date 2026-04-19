import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Receipt, Radio, Landmark, Ban } from "lucide-react";

type Case = {
  id: string;
  label: string;
  path: ("tva" | "public" | "particulier" | "etranger" | "proFr")[];
  result: "einv" | "erep" | "chorus" | "hors";
};

const CASES: Case[] = [
  { id: "b2b-fr", label: "SAS française → SAS française", path: ["tva", "proFr"], result: "einv" },
  { id: "b2g", label: "SAS française → Mairie", path: ["tva", "public"], result: "chorus" },
  { id: "b2c", label: "SAS française → particulier", path: ["tva", "particulier"], result: "erep" },
  { id: "intra", label: "SAS française → société allemande", path: ["tva", "etranger"], result: "erep" },
  { id: "hors", label: "Cession hors champ TVA", path: [], result: "hors" },
];

const RESULTS = {
  einv: { icon: <Receipt className="h-4 w-4" />, label: "E-invoicing", color: "#0369A1" },
  erep: { icon: <Radio className="h-4 w-4" />, label: "E-reporting", color: "#0369A1" },
  chorus: { icon: <Landmark className="h-4 w-4" />, label: "Chorus Pro", color: "#64748B" },
  hors: { icon: <Ban className="h-4 w-4" />, label: "Hors périmètre", color: "#94A3B8" },
};

export default function ScopeFlow() {
  const [active, setActive] = useState<string>("b2b-fr");
  const reduce = useReducedMotion();
  const current = CASES.find((c) => c.id === active)!;
  const res = RESULTS[current.result];

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Arbre de décision — choisissez un cas
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            aria-pressed={c.id === active}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              c.id === active
                ? "border-[#0369A1] bg-[#0369A1] text-white"
                : "border-[var(--color-border)] text-[var(--color-primary)] hover:border-[#0369A1]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-5 flex flex-wrap items-center gap-2 text-xs"
      >
        <Step label="Opération" active />
        <Arrow />
        <Step label="Dans le champ TVA ?" active={current.path.includes("tva") || current.result === "hors"} answer={current.result === "hors" ? "Non" : "Oui"} />
        {current.path.includes("tva") && (
          <>
            <Arrow />
            {current.path.includes("public") && <Step label="Destinataire public" active answer="Oui" />}
            {current.path.includes("particulier") && <Step label="Particulier" active answer="Oui" />}
            {current.path.includes("etranger") && <Step label="Entreprise étrangère" active answer="Oui" />}
            {current.path.includes("proFr") && <Step label="Entreprise française assujettie" active answer="Oui" />}
          </>
        )}
        <Arrow />
        <motion.span
          layout
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-white"
          style={{ backgroundColor: res.color }}
        >
          {res.icon}
          {res.label}
        </motion.span>
      </motion.div>
    </div>
  );
}

function Step({ label, active, answer }: { label: string; active?: boolean; answer?: string }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 ${
        active ? "border-[#0369A1]/40 bg-[#0369A1]/5 text-[var(--color-primary)]" : "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
      }`}
    >
      {label}
      {answer && <span className="ml-1 text-[#0369A1]">→ {answer}</span>}
    </span>
  );
}

function Arrow() {
  return <span className="text-[var(--color-muted-foreground)]">›</span>;
}

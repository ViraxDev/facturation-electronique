import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileCode, FileText, Layers } from "lucide-react";

type FormatKey = "ubl" | "cii" | "facturx";

const DATA: Record<
  FormatKey,
  {
    label: string;
    tagline: string;
    icon: typeof FileCode;
    color: string;
    bg: string;
    points: string[];
    sample: string;
  }
> = {
  ubl: {
    label: "UBL 2.1",
    tagline: "OASIS — XML sémantique, PEPPOL",
    icon: FileCode,
    color: "#0369A1",
    bg: "bg-sky-50 border-sky-200",
    points: [
      "OASIS Universal Business Language",
      "Socle PEPPOL européen",
      "XML autoporté, lisible",
    ],
    sample: `<Invoice>
  <cbc:ID>F-2026-001</cbc:ID>
  <cbc:IssueDate>2026-09-01</cbc:IssueDate>
  <cac:AccountingSupplierParty>...</cac:AccountingSupplierParty>
</Invoice>`,
  },
  cii: {
    label: "UN/CEFACT CII",
    tagline: "Cross Industry Invoice — ONU",
    icon: Layers,
    color: "#7C3AED",
    bg: "bg-violet-50 border-violet-200",
    points: [
      "Standard ONU/CEFACT",
      "Sous-jacent à Factur-X",
      "Proche EDIFACT historique",
    ],
    sample: `<rsm:CrossIndustryInvoice>
  <rsm:ExchangedDocument>
    <ram:ID>F-2026-001</ram:ID>
  </rsm:ExchangedDocument>
</rsm:CrossIndustryInvoice>`,
  },
  facturx: {
    label: "Factur-X",
    tagline: "PDF/A-3 + XML CII embarqué",
    icon: FileText,
    color: "#0F172A",
    bg: "bg-slate-50 border-slate-300",
    points: [
      "Hybride PDF + XML",
      "Double valence humaine/machine",
      "Adoption progressive PME",
    ],
    sample: `PDF/A-3
  └─ /EmbeddedFiles
       └─ factur-x.xml (CII)`,
  },
};

export default function TroisFormatsCompare() {
  const [active, setActive] = useState<FormatKey>("facturx");
  const reduce = useReducedMotion();
  const keys: FormatKey[] = ["ubl", "cii", "facturx"];

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="Comparatif des trois formats socles"
    >
      <figcaption className="mb-3 text-sm font-semibold text-slate-700">
        Les 3 formats socles — cliquer pour comparer
      </figcaption>

      <div role="tablist" className="grid grid-cols-3 gap-2">
        {keys.map((k) => {
          const d = DATA[k];
          const Icon = d.icon;
          const selected = active === k;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={selected}
              aria-label={`Voir ${d.label}`}
              onClick={() => setActive(k)}
              className={`relative rounded-lg border p-3 text-left transition-colors ${d.bg} ${
                selected ? "ring-2 ring-offset-1" : "opacity-80 hover:opacity-100"
              }`}
              style={selected ? { ["--tw-ring-color" as string]: d.color } : undefined}
            >
              {selected && (
                <motion.div
                  layoutId="format-underline"
                  className="absolute inset-x-2 -bottom-[2px] h-[3px] rounded"
                  style={{ background: d.color }}
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: d.color }} aria-hidden />
                <span className="text-sm font-semibold" style={{ color: d.color }}>
                  {d.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600">{d.tagline}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={reduce ? { duration: 0 } : { duration: 0.22 }}
          className="mt-4 grid gap-3 md:grid-cols-2"
        >
          <ul className="space-y-1.5 text-sm text-slate-700">
            {DATA[active].points.map((p) => (
              <li key={p} className="flex gap-2">
                <span
                  className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: DATA[active].color }}
                  aria-hidden
                />
                {p}
              </li>
            ))}
          </ul>
          <pre className="overflow-auto rounded-md bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
            <code>{DATA[active].sample}</code>
          </pre>
        </motion.div>
      </AnimatePresence>
    </figure>
  );
}

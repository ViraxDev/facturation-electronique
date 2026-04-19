import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle, ShieldCheck } from "lucide-react";

type Mention = { id: string; label: string; code: string; critical?: boolean };

const MENTIONS: Mention[] = [
  { id: "num", label: "Numéro de facture unique", code: "BT-1", critical: true },
  { id: "date", label: "Date d'émission", code: "BT-2", critical: true },
  { id: "seller-name", label: "Nom / raison sociale vendeur", code: "BT-27", critical: true },
  { id: "seller-addr", label: "Adresse vendeur", code: "BG-5" },
  { id: "seller-siren", label: "SIREN / SIRET vendeur", code: "BT-30", critical: true },
  { id: "seller-vat", label: "Numéro TVA intra vendeur", code: "BT-31" },
  { id: "buyer-name", label: "Nom / raison sociale acheteur", code: "BT-44", critical: true },
  { id: "buyer-addr", label: "Adresse acheteur", code: "BG-8" },
  { id: "buyer-siren", label: "SIREN acheteur (B2B FR)", code: "BT-47-FR", critical: true },
  { id: "lines", label: "Désignation, quantité, prix unitaire HT", code: "BG-25", critical: true },
  { id: "vat", label: "Taux et montant TVA par taux", code: "BG-23", critical: true },
  { id: "total-ht", label: "Total HT", code: "BT-109", critical: true },
  { id: "total-ttc", label: "Total TTC", code: "BT-112", critical: true },
  { id: "due", label: "Date d'échéance / conditions", code: "BT-9" },
  { id: "penal", label: "Mentions pénalités retard", code: "BT-FR" },
  { id: "ctc", label: "Extension CTC FR (PA, cycle)", code: "BG-FR", critical: true },
];

export default function MentionsChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();
  const total = MENTIONS.length;
  const checked = Object.values(done).filter(Boolean).length;
  const percent = Math.round((checked / total) * 100);

  const criticalMissing = useMemo(
    () => MENTIONS.filter((m) => m.critical && !done[m.id]).length,
    [done],
  );

  const toggle = (id: string) =>
    setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Checklist des mentions obligatoires d'une facture électronique"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ShieldCheck size={16} className="text-violet-600" aria-hidden />
          Mentions obligatoires — cochez pour auditer
        </figcaption>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            background: percent === 100 ? "#dcfce7" : "#ede9fe",
            color: percent === 100 ? "#166534" : "#5b21b6",
          }}
          aria-live="polite"
        >
          {checked}/{total} — {percent}%
        </span>
      </div>

      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: criticalMissing > 0 ? "#7C3AED" : "#16A34A" }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.4 }}
        />
      </div>

      <ul className="grid gap-1.5 sm:grid-cols-2">
        {MENTIONS.map((m) => {
          const isDone = !!done[m.id];
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => toggle(m.id)}
                aria-pressed={isDone}
                aria-label={`${m.label} ${m.code}`}
                className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                  isDone
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-violet-300"
                }`}
              >
                <motion.span
                  initial={false}
                  animate={reduce ? {} : { scale: isDone ? 1 : 0.9 }}
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  {isDone ? <Check size={12} aria-hidden /> : <Circle size={10} aria-hidden />}
                </motion.span>
                <span
                  className={`flex-1 ${isDone ? "text-slate-500 line-through" : "text-slate-800"}`}
                >
                  {m.label}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    m.critical ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {m.code}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {criticalMissing > 0 && (
        <p className="mt-3 text-[11px] text-violet-700">
          {criticalMissing} mention{criticalMissing > 1 ? "s" : ""} critique
          {criticalMissing > 1 ? "s" : ""} manquante{criticalMissing > 1 ? "s" : ""} —
          facture potentiellement rejetée par la PA.
        </p>
      )}
    </figure>
  );
}

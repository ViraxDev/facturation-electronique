import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, BookMarked, Server, CheckCircle2 } from "lucide-react";

type Entry = { siret: string; raison: string; pa: string; formats: string[] };

const DIRECTORY: Entry[] = [
  { siret: "552 120 222 00013", raison: "AutoParts SARL", pa: "Beta", formats: ["UBL", "Factur-X"] },
  { siret: "812 987 654 00021", raison: "Boulangerie Martin", pa: "Gamma (offre TPE)", formats: ["Factur-X"] },
  { siret: "432 100 777 00015", raison: "Industria Group", pa: "Alpha (API directe)", formats: ["Factur-X", "UBL", "CII"] },
];

export default function PpfAnnuaire() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Entry | null>(null);
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const lookup = (e: Entry) => {
    setSelected(e);
    setStep(1);
    const t1 = setTimeout(() => setStep(2), reduce ? 0 : 700);
    const t2 = setTimeout(() => setStep(3), reduce ? 0 : 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-gradient-to-br from-white to-sky-50 p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Annuaire PPF : interrogation</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">
        Choisis un destinataire fictif : la PA émettrice interroge l'annuaire pour router la facture.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {DIRECTORY.map((e) => (
          <button
            key={e.siret}
            type="button"
            onClick={() => lookup(e)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
              selected?.siret === e.siret
                ? "border-sky-600 bg-sky-50"
                : "border-slate-200 bg-white hover:border-sky-300"
            }`}
            aria-label={`Interroger l'annuaire pour ${e.raison}`}
          >
            <div className="font-semibold text-slate-900">{e.raison}</div>
            <div className="text-[11px] text-slate-500">SIRET {e.siret}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white">
            <Server size={20} aria-hidden="true" />
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-900">PA émettrice</div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
            <BookMarked size={20} aria-hidden="true" />
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-900">Annuaire PPF</div>
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                key="q"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5 }}
                className="absolute -top-1 left-0 -translate-x-1/2 rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-900"
              >
                <Search size={11} className="mr-1 inline" aria-hidden="true" />SIRET ?
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-700 text-white">
            <Server size={20} aria-hidden="true" />
          </div>
          <div className="mt-2 text-xs font-semibold text-slate-900">PA destinataire</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected && step >= 3 && (
          <motion.div
            key={selected.siret}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            <div className="mb-1 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 size={16} aria-hidden="true" /> Réponse de l'annuaire
            </div>
            <div>
              <span className="font-semibold">{selected.raison}</span> est rattachée à la PA
              {" "}<span className="font-semibold">{selected.pa}</span>. Formats acceptés :{" "}
              {selected.formats.join(", ")}.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

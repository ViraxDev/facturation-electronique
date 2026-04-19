import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, CreditCard, Landmark, Play, RotateCcw } from "lucide-react";

const EMERALD = "#059669";
const ACCENT = "#0369A1";
const NAVY = "#0F172A";

type Step = {
  id: string;
  label: string;
  date: string;
  amount?: string;
  tva?: number;
  detail: string;
  icon: "invoice" | "pay" | "report";
};

const STEPS: Step[] = [
  { id: "invoice", label: "Facture émise", date: "5 oct.", amount: "10 000 € HT", detail: "Statut déposée — facture Factur-X transmise via PA.", icon: "invoice" },
  { id: "pay1", label: "Encaissement partiel", date: "20 oct.", amount: "6 000 € TTC", tva: 1000, detail: "40 % d'acompte. TVA exigible au prorata : 1 000 €.", icon: "pay" },
  { id: "rep1", label: "E-reporting oct.", date: "31 oct.", detail: "Statut 'encaissée partiel' remonté → pré-remplissage CA3 octobre.", icon: "report" },
  { id: "pay2", label: "Encaissement solde", date: "15 nov.", amount: "6 000 € TTC", tva: 1000, detail: "Solde. TVA exigible complémentaire : 1 000 €.", icon: "pay" },
  { id: "rep2", label: "E-reporting nov.", date: "30 nov.", detail: "Statut 'encaissée' final → pré-remplissage CA3 novembre.", icon: "report" },
];

function StepIcon({ icon, active }: { icon: Step["icon"]; active: boolean }) {
  const color = active ? (icon === "invoice" ? NAVY : icon === "pay" ? EMERALD : ACCENT) : "#CBD5E1";
  const Cmp = icon === "invoice" ? FileText : icon === "pay" ? CreditCard : Landmark;
  return <Cmp size={18} color={color} aria-hidden />;
}

export default function PaymentTimeline() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reduce) return;
    if (idx >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIdx(i => i + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, idx, reduce]);

  const tvaCumul = STEPS.slice(0, idx + 1).reduce((s, x) => s + (x.tva ?? 0), 0);

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Timeline d'une facture de prestation : exigibilité TVA aux encaissements"
    >
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>Prestation de services 10 000 € HT — TVA sur encaissements</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (idx >= STEPS.length - 1) setIdx(0);
              setPlaying(p => !p);
            }}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <Play size={12} aria-hidden /> {playing ? "Pause" : idx >= STEPS.length - 1 ? "Rejouer" : "Lecture"}
          </button>
          <button
            type="button"
            onClick={() => { setIdx(0); setPlaying(false); }}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            aria-label="Réinitialiser"
          >
            <RotateCcw size={12} aria-hidden />
          </button>
        </div>
      </figcaption>

      <ol className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-0">
        {/* progress bar */}
        <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-slate-200 sm:left-0 sm:top-4 sm:h-0.5 sm:w-full" aria-hidden />
        <motion.div
          className="absolute left-4 top-0 hidden w-0.5 bg-emerald-500 sm:left-0 sm:top-4 sm:h-0.5"
          initial={false}
          animate={{ width: `${(idx / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: reduce ? 0 : 0.5 }}
          aria-hidden
        />

        {STEPS.map((s, i) => {
          const active = i <= idx;
          return (
            <li
              key={s.id}
              className="relative flex-1 cursor-pointer sm:pt-10"
              onClick={() => setIdx(i)}
              aria-current={i === idx}
            >
              <button
                type="button"
                className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 sm:top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition ${
                  active ? "border-emerald-600" : "border-slate-200"
                }`}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                aria-label={`Étape ${i + 1} : ${s.label}`}
              >
                <StepIcon icon={s.icon} active={active} />
              </button>
              <div className={`ml-12 sm:ml-0 sm:px-2 sm:text-center ${active ? "" : "opacity-50"}`}>
                <div className="text-[10px] font-mono text-slate-500">{s.date}</div>
                <div className="text-xs font-semibold text-slate-800">{s.label}</div>
                {s.amount && <div className="font-mono text-[11px] text-slate-600">{s.amount}</div>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
          <div className="mb-1 font-semibold text-slate-800">Étape {idx + 1} / {STEPS.length}</div>
          {STEPS[idx].detail}
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 text-xs text-slate-700">
          <div className="mb-1 font-semibold text-emerald-800">TVA exigible cumulée</div>
          <div className="font-mono text-lg text-emerald-700">{tvaCumul.toLocaleString("fr-FR")} € / 2 000 €</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
            <motion.div
              className="h-full bg-emerald-600"
              initial={false}
              animate={{ width: `${(tvaCumul / 2000) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            />
          </div>
        </div>
      </div>
    </figure>
  );
}

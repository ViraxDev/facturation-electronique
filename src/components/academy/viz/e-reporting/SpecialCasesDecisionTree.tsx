import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";

const EMERALD = "#059669";

type Answers = {
  assujetti?: boolean;
  franchise?: boolean;
  clientele?: "B2B" | "B2C" | "MIX";
};

type Step = {
  key: keyof Answers;
  question: string;
  options: { value: string; label: string }[];
};

const STEPS: Step[] = [
  {
    key: "assujetti",
    question: "Êtes-vous assujetti à la TVA (y compris auto-entrepreneur) ?",
    options: [
      { value: "true", label: "Oui (y compris micro)" },
      { value: "false", label: "Non, activité hors champ TVA" },
    ],
  },
  {
    key: "franchise",
    question: "Êtes-vous en franchise en base (art. 293 B CGI) ?",
    options: [
      { value: "true", label: "Oui (franchise TVA)" },
      { value: "false", label: "Non, je collecte la TVA" },
    ],
  },
  {
    key: "clientele",
    question: "Votre clientèle est principalement :",
    options: [
      { value: "B2B", label: "B2B (entreprises)" },
      { value: "B2C", label: "B2C (particuliers)" },
      { value: "MIX", label: "Mixte" },
    ],
  },
];

function verdict(a: Answers): { title: string; bullets: string[]; tone: "ok" | "out" } {
  if (a.assujetti === false) {
    return {
      title: "Hors champ TVA — non concerné",
      tone: "out",
      bullets: [
        "Les opérations hors champ (art. 256 A CGI) ne sont pas concernées par l'e-invoicing.",
        "Vigilance : bien distinguer hors champ et exonéré.",
      ],
    };
  }
  const b: string[] = [
    "Réception obligatoire des factures électroniques au 1er septembre 2026.",
    "Émission obligatoire au 1er septembre 2027 (TPE/micro).",
  ];
  if (a.franchise) {
    b.push("Mention obligatoire : « TVA non applicable, art. 293 B du CGI ».");
    b.push("Pas de TVA à transmettre, mais facture électronique conforme exigée.");
  }
  if (a.clientele === "B2B" || a.clientele === "MIX") {
    b.push("E-invoicing pour les ventes B2B domestiques (assujettis FR).");
  }
  if (a.clientele === "B2C" || a.clientele === "MIX") {
    b.push("E-reporting agrégé pour les ventes B2C (totaux par taux, nombre de transactions).");
  }
  return { title: "Concerné par la réforme", tone: "ok", bullets: b };
}

export default function SpecialCasesDecisionTree() {
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);

  const done =
    answers.assujetti === false ||
    (step >= STEPS.length) ||
    (answers.assujetti !== undefined && answers.franchise !== undefined && answers.clientele !== undefined);

  function choose(val: string) {
    const s = STEPS[step];
    const parsed: boolean | string = val === "true" ? true : val === "false" ? false : val;
    const next = { ...answers, [s.key]: parsed as never };
    setAnswers(next);
    if (s.key === "assujetti" && parsed === false) {
      setStep(STEPS.length);
    } else {
      setStep(step + 1);
    }
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  const result = done ? verdict(answers) : null;

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Arbre de décision pour les cas spéciaux : auto-entrepreneur, franchise TVA, hors champ"
    >
      <figcaption className="mb-4 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>Votre cas : un arbre de décision</span>
        {(step > 0 || done) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw size={12} aria-hidden /> Recommencer
          </button>
        )}
      </figcaption>

      <div className="mb-4 flex gap-1" aria-hidden>
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition ${
              i < step ? "bg-emerald-600" : i === step && !done ? "bg-emerald-300" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done && (
          <motion.div
            key={`q-${step}`}
            initial={reduce ? false : { y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mb-3 font-medium text-slate-800">{STEPS[step].question}</p>
            <div className="flex flex-col gap-2">
              {STEPS[step].options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => choose(opt.value)}
                  className="group flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                >
                  {opt.label}
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-600" aria-hidden />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {done && result && (
          <motion.div
            key="result"
            initial={reduce ? false : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-lg border-2 p-4 ${
              result.tone === "ok"
                ? "border-emerald-600 bg-emerald-50"
                : "border-slate-300 bg-slate-50"
            }`}
            role="status"
          >
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2
                size={18}
                aria-hidden
                color={result.tone === "ok" ? EMERALD : "#475569"}
              />
              <strong className={result.tone === "ok" ? "text-emerald-800" : "text-slate-700"}>
                {result.title}
              </strong>
            </div>
            <ul className="ml-1 list-disc space-y-1 pl-4 text-sm text-slate-700">
              {result.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

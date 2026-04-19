import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

type Step = {
  dir: "req" | "res";
  from: string;
  to: string;
  method?: string;
  endpoint?: string;
  status?: string;
  body: string;
};

const STEPS: Step[] = [
  {
    dir: "req",
    from: "ERP",
    to: "PA",
    method: "POST",
    endpoint: "/v1/invoices",
    body: `{
  "format": "FACTUR-X",
  "profile": "EN16931",
  "content": "<base64>"
}`,
  },
  {
    dir: "res",
    from: "PA",
    to: "ERP",
    status: "202 Accepted",
    body: `{
  "invoiceId": "inv_9f2c",
  "status": "200-DEPOSEE"
}`,
  },
  {
    dir: "req",
    from: "ERP",
    to: "PA",
    method: "GET",
    endpoint: "/v1/invoices/inv_9f2c/status",
    body: "(pas de corps)",
  },
  {
    dir: "res",
    from: "PA",
    to: "ERP",
    status: "200 OK",
    body: `{
  "invoiceId": "inv_9f2c",
  "status": "207-APPROUVEE",
  "updatedAt": "2026-09-15T10:24:00Z"
}`,
  },
];

export default function APISequence() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (i >= STEPS.length - 1) {
        setPlaying(false);
      } else {
        setI((x) => x + 1);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [playing, i]);

  const step = STEPS[i];
  const isReq = step.dir === "req";

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Séquence d'appels API REST entre ERP et Plateforme Agréée"
    >
      <div className="mb-3 flex items-center justify-between">
        <figcaption className="text-sm font-semibold text-slate-700">
          API REST — ERP ↔ Plateforme Agréée
        </figcaption>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
              if (i >= STEPS.length - 1) setI(0);
            }}
            aria-label="Jouer la séquence"
            className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-violet-700"
          >
            <Play size={12} aria-hidden /> Lire
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setI(0);
            }}
            aria-label="Réinitialiser"
            className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            <RotateCcw size={12} aria-hidden /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-lg border-2 border-sky-300 bg-sky-50 p-3 text-center">
          <p className="text-xs uppercase tracking-wide text-sky-700">Client</p>
          <p className="text-lg font-bold text-slate-900">ERP</p>
        </div>

        <div className="flex h-20 w-16 flex-col items-center justify-center">
          <motion.div
            key={i + (isReq ? "-req" : "-res")}
            initial={reduce ? false : { x: isReq ? -20 : 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
              isReq ? "bg-violet-600 text-white" : "bg-emerald-600 text-white"
            }`}
            aria-live="polite"
          >
            {isReq ? (
              <>
                {step.method}
                <ArrowRight size={10} aria-hidden />
              </>
            ) : (
              <>
                <ArrowLeft size={10} aria-hidden />
                {step.status}
              </>
            )}
          </motion.div>
        </div>

        <div className="rounded-lg border-2 border-violet-300 bg-violet-50 p-3 text-center">
          <p className="text-xs uppercase tracking-wide text-violet-700">Serveur</p>
          <p className="text-lg font-bold text-slate-900">PA</p>
        </div>
      </div>

      <motion.div
        key={`body-${i}`}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        className="mt-4"
      >
        {step.endpoint && (
          <p className="mb-1 font-mono text-[11px] text-slate-600">
            <span
              className={`mr-1 rounded px-1.5 py-0.5 font-semibold text-white ${
                isReq ? "bg-violet-600" : "bg-emerald-600"
              }`}
            >
              {step.method || step.status}
            </span>
            {step.endpoint}
          </p>
        )}
        <pre className="overflow-auto rounded-md bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100">
          <code>{step.body}</code>
        </pre>
      </motion.div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5" role="tablist" aria-label="Étapes">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPlaying(false);
                setI(idx);
              }}
              role="tab"
              aria-selected={idx === i}
              aria-label={`Étape ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-8 bg-violet-600" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500">
          Étape {i + 1}/{STEPS.length}
        </p>
      </div>
    </figure>
  );
}

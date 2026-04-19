import { useState } from "react";
import { markToolUsed } from "@/stores/progression";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

type Taille = "GE" | "ETI" | "PME" | "TPE" | "micro";
type Answers = {
  assujettiTVA?: boolean;
  etablieFrance?: boolean;
  taille?: Taille;
  clientsB2B?: boolean;
  clientsB2C?: boolean;
  international?: boolean;
};

const QUESTIONS: { key: keyof Answers; label: string; options: { value: string; label: string }[] }[] = [
  { key: "assujettiTVA", label: "Votre entreprise est-elle assujettie à la TVA en France ?", options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non (franchise en base)" }] },
  { key: "etablieFrance", label: "Êtes-vous établi en France ?", options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }] },
  { key: "taille", label: "Taille de l'entreprise ?", options: [{ value: "GE", label: "Grande Entreprise" }, { value: "ETI", label: "ETI" }, { value: "PME", label: "PME" }, { value: "TPE", label: "TPE" }, { value: "micro", label: "Micro-entrepreneur" }] },
  { key: "clientsB2B", label: "Facturez-vous à des entreprises françaises (B2B domestique) ?", options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }] },
  { key: "clientsB2C", label: "Facturez-vous à des particuliers (B2C) ?", options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }] },
  { key: "international", label: "Facturez-vous à l'étranger ou achetez-vous à l'étranger ?", options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }] },
];

function compute(a: Answers): { verdict: string; dateReception: string; dateEmission: string; obligations: string[] } {
  if (!a.assujettiTVA || !a.etablieFrance) {
    return { verdict: "Non concerné par l'obligation d'émission e-invoicing B2B", dateReception: "—", dateEmission: "—", obligations: ["Restez vigilant : l'e-reporting peut s'appliquer selon vos flux."] };
  }
  const bigEmitter = a.taille === "GE" || a.taille === "ETI";
  const dateEmission = bigEmitter ? "1ᵉʳ septembre 2026" : "1ᵉʳ septembre 2027";
  const dateReception = "1ᵉʳ septembre 2026";
  const obligations: string[] = [];
  obligations.push(`Recevoir toute facture électronique au format structuré dès le ${dateReception}.`);
  if (a.clientsB2B) obligations.push(`Émettre au format structuré (Factur-X/UBL/CII) dès le ${dateEmission}.`);
  if (a.clientsB2C) obligations.push("E-reporting B2C : transmettre les données de transactions à la DGFiP.");
  if (a.international) obligations.push("E-reporting international : transmettre les données des opérations extra-communautaires et intracommunautaires.");
  obligations.push("Se raccorder à une Plateforme Agréée (PA) ou via un Opérateur de Dématérialisation (OD).");
  return { verdict: `Vous êtes concerné par la réforme (taille : ${a.taille}).`, dateReception, dateEmission, obligations };
}

export default function EligibiliteSimulator() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];

  function answer(value: string) {
    const parsed = value === "true" ? true : value === "false" ? false : value;
    const next = { ...answers, [q.key]: parsed };
    setAnswers(next);
    if (idx < QUESTIONS.length - 1) setIdx(idx + 1);
    else { setDone(true); markToolUsed("eligibilite"); }
  }

  function reset() { setIdx(0); setAnswers({}); setDone(false); }

  if (done) {
    const r = compute(answers);
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4"><CheckCircle2 className="h-6 w-6" aria-hidden="true"/></div>
        <h3 className="text-xl font-bold text-[var(--color-primary)]">{r.verdict}</h3>
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[var(--color-border)] p-4"><dt className="text-xs text-[var(--color-muted-foreground)]">Obligation de réception</dt><dd className="mt-1 text-lg font-semibold tabular">{r.dateReception}</dd></div>
          <div className="rounded-xl border border-[var(--color-border)] p-4"><dt className="text-xs text-[var(--color-muted-foreground)]">Obligation d'émission</dt><dd className="mt-1 text-lg font-semibold tabular">{r.dateEmission}</dd></div>
        </dl>
        <h4 className="mt-6 font-semibold">Vos obligations :</h4>
        <ul className="mt-2 space-y-2 text-sm">{r.obligations.map((o, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true"/><span>{o}</span></li>)}</ul>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"><RotateCcw className="h-4 w-4" aria-hidden="true"/> Refaire le test</button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="text-xs text-[var(--color-muted-foreground)] mb-2">Question {idx + 1} / {QUESTIONS.length}</div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={idx} className="h-1.5 rounded-full bg-[var(--color-muted)] mb-6 overflow-hidden"><div className="h-full bg-[var(--color-accent)] transition-[width]" style={{ width: `${(idx / QUESTIONS.length) * 100}%` }}/></div>
      <h3 className="text-lg font-semibold mb-4">{q.label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((o) => (
          <button key={o.value} onClick={() => answer(o.value)} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-left hover:border-[var(--color-accent)] hover:bg-sky-50 transition-colors">
            <span>{o.label}</span><ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" aria-hidden="true"/>
          </button>
        ))}
      </div>
    </div>
  );
}

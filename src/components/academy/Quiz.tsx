import { useState } from "react";
import { completeModule, recordQuiz } from "@/stores/progression";
import { CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";

type Question = { question: string; options: string[]; correct: number; explanation: string };

export default function Quiz({ slug, moduleTitle, xp, questions }: { slug: string; moduleTitle: string; xp: number; questions: Question[] }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function submit() {
    if (selected === null) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setAttempts((a) => a + 1);
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      const correct = nextAnswers.filter((a, i) => a === questions[i].correct).length;
      const firstTry = attempts + 1 === questions.length;
      recordQuiz(slug, correct, questions.length, firstTry);
      completeModule(slug, xp);
      setDone(true);
    }
  }

  function reset() {
    setIdx(0);
    setAnswers([]);
    setSelected(null);
    setAttempts(0);
    setDone(false);
  }

  if (done) {
    const correct = answers.filter((a, i) => a === questions[i].correct).length;
    const perfect = correct === questions.length;
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white mb-4">
          <Award className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold mb-2">Module terminé !</h3>
        <p className="text-[var(--color-muted-foreground)] mb-4" aria-live="polite">
          Score : <strong className="tabular">{correct} / {questions.length}</strong> · +{xp} XP {perfect && "· 🏆"}
        </p>
        <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-muted)]">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Rejouer le quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="flex items-center justify-between text-sm text-[var(--color-muted-foreground)] mb-4">
        <span>Question {idx + 1} / {questions.length}</span>
        <span className="tabular">{moduleTitle}</span>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={idx} className="h-1.5 rounded-full bg-[var(--color-muted)] mb-6 overflow-hidden">
        <div className="h-full bg-[var(--color-accent)] transition-[width]" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <fieldset className="space-y-2" aria-label="Réponses possibles">
        <legend className="sr-only">{q.question}</legend>
        {q.options.map((opt, i) => (
          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected === i ? "border-[var(--color-accent)] bg-sky-50" : "border-[var(--color-border)] hover:bg-[var(--color-muted)]"}`}>
            <input type="radio" name={`q-${idx}`} className="mt-1" checked={selected === i} onChange={() => setSelected(i)} />
            <span>{opt}</span>
          </label>
        ))}
      </fieldset>
      <div className="mt-6 flex justify-end">
        <button onClick={submit} disabled={selected === null} className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          {idx < questions.length - 1 ? "Question suivante" : "Terminer le module"}
        </button>
      </div>
    </div>
  );
}

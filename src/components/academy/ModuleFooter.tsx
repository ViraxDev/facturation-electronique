import { useStore } from "@nanostores/react";
import { progression, completeModule } from "@/stores/progression";
import { CheckCircle2, ArrowRight, ArrowLeft, Trophy } from "lucide-react";

type NavItem = { slug: string; title: string; order: number };

export default function ModuleFooter({
  slug,
  xp,
  prev,
  next,
  parcoursId,
  parcoursTitle,
}: {
  slug: string;
  xp: number;
  prev: NavItem | null;
  next: NavItem | null;
  parcoursId: string;
  parcoursTitle: string;
}) {
  const p = useStore(progression);
  const done = p.modulesCompleted.includes(slug);

  return (
    <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
      <div
        className={`rounded-2xl p-6 ${
          done
            ? "bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-200"
            : "border border-[var(--color-border)] bg-white"
        }`}
      >
        {done ? (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[var(--color-primary)]">Module complété</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Bravo — +{xp} XP enregistrés. Continuez votre progression.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-white">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-primary)]">Terminé la lecture ?</h3>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                  Validez ce module pour gagner +{xp} XP.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => completeModule(slug, xp)}
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              Marquer comme terminé <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <nav
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
        aria-label="Navigation entre modules"
      >
        {prev ? (
          <a
            href={`/academy/modules/${prev.slug}`}
            className="group rounded-xl border border-[var(--color-border)] bg-white p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[var(--color-muted-foreground)]">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Précédent · M{prev.order}
            </span>
            <div className="mt-1.5 text-sm font-semibold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {prev.title}
            </div>
          </a>
        ) : (
          <div />
        )}
        {next ? (
          <a
            href={`/academy/modules/${next.slug}`}
            className="group sm:text-right rounded-xl border-2 border-[#0284C7] bg-gradient-to-br from-sky-50 to-white p-4 hover:shadow-[var(--shadow-feat)] transition-shadow"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-[var(--color-accent)]">
              Suivant · M{next.order} <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
            <div className="mt-1.5 text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
              {next.title}
            </div>
          </a>
        ) : (
          <a
            href={`/academy/parcours/${parcoursId}`}
            className="group sm:text-right rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-white p-4 hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em] text-emerald-700">
              Fin du parcours <Trophy className="h-3 w-3" aria-hidden="true" />
            </span>
            <div className="mt-1.5 text-sm font-bold text-[var(--color-primary)]">
              Retour à « {parcoursTitle} »
            </div>
          </a>
        )}
      </nav>
    </section>
  );
}

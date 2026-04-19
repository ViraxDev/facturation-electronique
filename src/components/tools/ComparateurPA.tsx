import { useEffect, useState, useMemo } from "react";
import { markToolUsed } from "@/stores/progression";
import { Search, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

type PA = {
  id: string; nom: string; site: string; description: string;
  cibles: string[]; formats: string[]; prix_indicatif: string;
  api: boolean; integrations: string[]; forces: string[];
  site_comptable: boolean;
};

export default function ComparateurPA() {
  const [all, setAll] = useState<PA[]>([]);
  const [q, setQ] = useState("");
  const [cible, setCible] = useState("");
  const [apiOnly, setApiOnly] = useState(false);
  const [comptableOnly, setComptableOnly] = useState(false);

  useEffect(() => {
    markToolUsed("comparateur-pa");
    fetch("/data/plateformes-agreees.json").then((r) => r.json()).then(setAll).catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => all.filter((p) => {
    if (q && !(p.nom.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))) return false;
    if (cible && !p.cibles.includes(cible)) return false;
    if (apiOnly && !p.api) return false;
    if (comptableOnly && !p.site_comptable) return false;
    return true;
  }), [all, q, cible, apiOnly, comptableOnly]);

  const cibleOptions = Array.from(new Set(all.flatMap((p) => p.cibles))).sort();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" aria-hidden="true"/>
          <label htmlFor="pa-q" className="sr-only">Rechercher</label>
          <input id="pa-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une plateforme..." className="w-full rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"/>
        </div>
        <div>
          <label htmlFor="pa-cible" className="sr-only">Cible</label>
          <select id="pa-cible" value={cible} onChange={(e) => setCible(e.target.value)} className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm">
            <option value="">Toutes cibles</option>
            {cibleOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={apiOnly} onChange={(e) => setApiOnly(e.target.checked)}/> API</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={comptableOnly} onChange={(e) => setComptableOnly(e.target.checked)}/> Orienté comptable</label>
        </div>
      </div>

      <p className="text-sm text-[var(--color-muted-foreground)]" aria-live="polite">{filtered.length} plateforme{filtered.length > 1 ? "s" : ""} correspondante{filtered.length > 1 ? "s" : ""}</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <li key={p.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--color-primary)]">{p.nom}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-3">{p.description}</p>
              </div>
              <a href={p.site} target="_blank" rel="noopener" aria-label={`Site de ${p.nom}`} className="flex-shrink-0 text-[var(--color-accent)]"><ExternalLink className="h-4 w-4" aria-hidden="true"/></a>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-[var(--color-muted-foreground)]">Prix</dt><dd className="font-medium">{p.prix_indicatif}</dd></div>
              <div><dt className="text-[var(--color-muted-foreground)]">API</dt><dd className="font-medium inline-flex items-center gap-1">{p.api ? <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true"/> Oui</> : <><XCircle className="h-3.5 w-3.5 text-red-600" aria-hidden="true"/> Non</>}</dd></div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-1">
              {p.cibles.map((c) => <span key={c} className="rounded-full bg-sky-100 text-sky-900 px-2 py-0.5 text-[10px] font-medium">{c}</span>)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Filter } from "lucide-react";

type PA = {
  name: string;
  profile: ("tpe" | "pme" | "eti" | "ge")[];
  sla: number; // %
  priceLabel: string;
  priceScore: number; // 0 cheap → 3 premium
  chorus: boolean;
  secnum: boolean;
  connectors: string[];
  status: "immatriculee" | "candidate";
};

const PAS: PA[] = [
  {
    name: "Alpha",
    profile: ["eti", "ge"],
    sla: 99.9,
    priceLabel: "79 €/mois forfait",
    priceScore: 2,
    chorus: true,
    secnum: true,
    connectors: ["Sage", "SAP", "Oracle"],
    status: "immatriculee",
  },
  {
    name: "Beta",
    profile: ["tpe", "pme"],
    sla: 99.5,
    priceLabel: "0,12 €/facture",
    priceScore: 1,
    chorus: true,
    secnum: false,
    connectors: ["Sage", "EBP", "Pennylane"],
    status: "immatriculee",
  },
  {
    name: "Gamma",
    profile: ["tpe", "pme"],
    sla: 99.0,
    priceLabel: "Gratuit (offre TPE)",
    priceScore: 0,
    chorus: false,
    secnum: false,
    connectors: ["Pennylane", "iPaidThat"],
    status: "candidate",
  },
  {
    name: "Delta",
    profile: ["eti", "ge"],
    sla: 99.95,
    priceLabel: "120 €/mois premium",
    priceScore: 3,
    chorus: true,
    secnum: true,
    connectors: ["SAP", "Divalto", "Oracle"],
    status: "immatriculee",
  },
  {
    name: "Epsilon",
    profile: ["pme", "eti"],
    sla: 99.7,
    priceLabel: "49 €/mois",
    priceScore: 1,
    chorus: true,
    secnum: true,
    connectors: ["Cegid", "Odoo", "Sage"],
    status: "immatriculee",
  },
];

type ProfileFilter = "all" | "tpe" | "pme" | "eti" | "ge";

export default function PaChoixGrille() {
  const reduce = useReducedMotion();
  const [profile, setProfile] = useState<ProfileFilter>("all");
  const [chorus, setChorus] = useState(false);
  const [secnum, setSecnum] = useState(false);
  const [immatOnly, setImmatOnly] = useState(true);

  const rows = useMemo(() => {
    return PAS.filter((p) => {
      if (profile !== "all" && !p.profile.includes(profile)) return false;
      if (chorus && !p.chorus) return false;
      if (secnum && !p.secnum) return false;
      if (immatOnly && p.status !== "immatriculee") return false;
      return true;
    });
  }, [profile, chorus, secnum, immatOnly]);

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-white p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Grille de choix d'une PA</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">
        Filtres indicatifs (échantillon pédagogique — consulter la liste officielle sur impots.gouv.fr).
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Filter size={14} aria-hidden="true" /> Filtres
        </div>
        <label className="text-xs text-slate-700">
          Profil
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as ProfileFilter)}
            className="ml-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
          >
            <option value="all">Tous</option>
            <option value="tpe">TPE</option>
            <option value="pme">PME</option>
            <option value="eti">ETI</option>
            <option value="ge">Grande entreprise</option>
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-700">
          <input type="checkbox" checked={chorus} onChange={(e) => setChorus(e.target.checked)} /> Connecteur Chorus Pro
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-700">
          <input type="checkbox" checked={secnum} onChange={(e) => setSecnum(e.target.checked)} /> SecNumCloud
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-700">
          <input type="checkbox" checked={immatOnly} onChange={(e) => setImmatOnly(e.target.checked)} /> Immatriculée uniquement
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-2 py-2">PA</th>
              <th className="px-2 py-2">Statut</th>
              <th className="px-2 py-2">SLA</th>
              <th className="px-2 py-2">Prix</th>
              <th className="px-2 py-2">Chorus</th>
              <th className="px-2 py-2">SecNumCloud</th>
              <th className="px-2 py-2">Connecteurs</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((p) => (
                <motion.tr
                  key={p.name}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                  className="border-t border-slate-100"
                >
                  <td className="px-2 py-2 font-semibold text-slate-900">{p.name}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        p.status === "immatriculee"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status === "immatriculee" ? "Immatriculée" : "Candidate"}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-slate-700">{p.sla} %</td>
                  <td className="px-2 py-2 text-slate-700">{p.priceLabel}</td>
                  <td className="px-2 py-2">
                    {p.chorus ? <CheckCircle2 size={16} className="text-emerald-600" aria-label="oui" /> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-2 py-2">
                    {p.secnum ? <CheckCircle2 size={16} className="text-emerald-600" aria-label="oui" /> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-600">{p.connectors.join(", ")}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-4 text-center text-sm text-slate-500">Aucune PA ne correspond à ces filtres.</div>
        )}
      </div>
    </div>
  );
}

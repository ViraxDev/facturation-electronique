import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Laptop, Puzzle, ShieldCheck, Landmark, ArrowRight } from "lucide-react";

type Stop = {
  id: "erp" | "od" | "pa" | "ppf";
  icon: any;
  label: string;
  sub: string;
  resp: string[];
};

const STOPS: Stop[] = [
  {
    id: "erp",
    icon: Laptop,
    label: "ERP / logiciel métier",
    sub: "Entreprise utilisatrice",
    resp: ["Saisie de la facture", "Référentiels internes (clients, produits)"],
  },
  {
    id: "od",
    icon: Puzzle,
    label: "OD",
    sub: "Éditeur, prestataire EDI",
    resp: [
      "Génération Factur-X / UBL / CII",
      "Règles métier, archivage",
      "Contrat d'adossement à une PA",
      "Information du client",
    ],
  },
  {
    id: "pa",
    icon: ShieldCheck,
    label: "PA",
    sub: "Plateforme agréée (AIFE/DGFiP)",
    resp: [
      "Immatriculation 3 ans renouvelable",
      "Contrôle conformité",
      "Routage via annuaire PPF",
      "Transmission fiscale",
    ],
  },
  {
    id: "ppf",
    icon: Landmark,
    label: "PPF / DGFiP",
    sub: "Annuaire + concentrateur",
    resp: ["Annuaire central", "Réception des données e-invoicing et statuts"],
  },
];

export default function OdPaChain() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Stop["id"]>("od");
  const current = STOPS.find((s) => s.id === active) ?? STOPS[1];

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-white p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Chaîne OD + PA : qui fait quoi ?</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">
        L'OD apporte l'interface, la PA porte la responsabilité réglementaire.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {STOPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === active;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isActive ? "border-sky-600 bg-sky-50" : "border-slate-200 bg-white hover:border-sky-300"
                }`}
                aria-pressed={isActive}
                aria-label={s.label}
              >
                <motion.span
                  animate={{ scale: isActive && !reduce ? 1.08 : 1 }}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                    isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                </motion.span>
                <div className="text-center">
                  <div className={`text-sm font-semibold ${isActive ? "text-sky-800" : "text-slate-900"}`}>
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-500">{s.sub}</div>
                </div>
              </button>
              {i < STOPS.length - 1 && (
                <motion.span
                  animate={!reduce ? { x: [0, 4, 0] } : undefined}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                  className="text-sky-500"
                >
                  <ArrowRight size={18} />
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.2 }}
        className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="mb-2 text-sm font-semibold text-slate-900">
          Responsabilités — {current.label}
        </div>
        <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {current.resp.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

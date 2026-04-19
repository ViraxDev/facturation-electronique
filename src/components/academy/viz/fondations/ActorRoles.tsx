import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Landmark, Server, Cog, Users, BookOpen, Briefcase } from "lucide-react";

type Actor = {
  id: string;
  name: string;
  kind: "institutionnel" | "operationnel" | "influence";
  icon: React.ReactNode;
  role: string;
};

const ACTORS: Actor[] = [
  {
    id: "dgfip",
    name: "DGFiP",
    kind: "institutionnel",
    icon: <Landmark className="h-4 w-4" />,
    role: "Autorité fiscale, tient l'Annuaire central, agrée les PA, reçoit les données d'e-invoicing et d'e-reporting.",
  },
  {
    id: "afnor",
    name: "AFNOR",
    kind: "institutionnel",
    icon: <BookOpen className="h-4 w-4" />,
    role: "Normalisation : transpose EN 16931, publie NF Z12-012 (Factur-X).",
  },
  {
    id: "pa",
    name: "Plateforme Agréée (PA)",
    kind: "operationnel",
    icon: <Server className="h-4 w-4" />,
    role: "Opérateur privé agréé : reçoit, route vers l'Annuaire, transmet à la PA du destinataire et à la DGFiP.",
  },
  {
    id: "od",
    name: "Opérateur de Dématérialisation (OD)",
    kind: "operationnel",
    icon: <Cog className="h-4 w-4" />,
    role: "Prestataire technique non agréé (éditeur logiciel) qui s'interface avec une PA partenaire.",
  },
  {
    id: "fnfe",
    name: "FNFE-MPE",
    kind: "influence",
    icon: <Users className="h-4 w-4" />,
    role: "Forum multipartite : promotion, bonnes pratiques, co-pilotage Factur-X avec FeRD.",
  },
  {
    id: "oec",
    name: "Ordre des experts-comptables",
    kind: "influence",
    icon: <Briefcase className="h-4 w-4" />,
    role: "Relais formation et accompagnement auprès des 20 000 experts-comptables.",
  },
];

const KINDS = [
  { id: "institutionnel", label: "Institutionnels", color: "#0F172A" },
  { id: "operationnel", label: "Opérationnels", color: "#0369A1" },
  { id: "influence", label: "Influence & accompagnement", color: "#64748B" },
] as const;

export default function ActorRoles() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Les acteurs par famille
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {KINDS.map((k) => (
          <div key={k.id}>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: k.color }} />
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                {k.label}
              </span>
            </div>
            <ul className="mt-2 space-y-2">
              {ACTORS.filter((a) => a.kind === k.id).map((a) => {
                const isOpen = expanded === a.id;
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm transition ${
                        isOpen
                          ? "border-[#0369A1] bg-[#0369A1]/5"
                          : "border-[var(--color-border)] hover:border-[#0369A1]/50"
                      }`}
                    >
                      <span style={{ color: k.color }}>{a.icon}</span>
                      <span className="flex-1 font-medium text-[var(--color-primary)]">{a.name}</span>
                    </button>
                    {isOpen && (
                      <motion.p
                        initial={reduce ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.25 }}
                        className="mt-1 overflow-hidden rounded-md bg-[var(--color-muted)] px-2.5 py-2 text-xs text-[var(--color-muted-foreground)]"
                      >
                        {a.role}
                      </motion.p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

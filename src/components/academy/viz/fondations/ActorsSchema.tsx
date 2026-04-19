import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, Server, Database, Landmark } from "lucide-react";

type NodeId = "emitter" | "paA" | "annuaire" | "paB" | "receiver" | "dgfip";

type NodeDef = {
  id: NodeId;
  label: string;
  sub: string;
  icon: React.ReactNode;
  x: number;
  y: number;
};

const NODES: NodeDef[] = [
  { id: "emitter", label: "Émetteur", sub: "Atelier Dupuis", icon: <Building2 className="h-4 w-4" />, x: 60, y: 220 },
  { id: "paA", label: "PA Alpha", sub: "Plateforme Agréée", icon: <Server className="h-4 w-4" />, x: 200, y: 220 },
  { id: "annuaire", label: "Annuaire central", sub: "DGFiP", icon: <Database className="h-4 w-4" />, x: 360, y: 60 },
  { id: "paB", label: "PA Beta", sub: "Plateforme Agréée", icon: <Server className="h-4 w-4" />, x: 520, y: 220 },
  { id: "receiver", label: "Récepteur", sub: "Groupe Industrix", icon: <Building2 className="h-4 w-4" />, x: 660, y: 220 },
  { id: "dgfip", label: "DGFiP", sub: "Données fiscales", icon: <Landmark className="h-4 w-4" />, x: 360, y: 360 },
];

type Edge = { from: NodeId; to: NodeId; label?: string };

const EDGES: Edge[] = [
  { from: "emitter", to: "paA", label: "Dépôt Factur-X" },
  { from: "paA", to: "annuaire", label: "Lookup adressage" },
  { from: "paA", to: "paB", label: "Routage facture" },
  { from: "paB", to: "receiver", label: "Mise à dispo" },
  { from: "paA", to: "dgfip", label: "Données fiscales" },
  { from: "paB", to: "dgfip", label: "Données fiscales" },
];

function nodeById(id: NodeId) {
  return NODES.find((n) => n.id === id)!;
}

export default function ActorsSchema() {
  const [hover, setHover] = useState<NodeId | null>(null);
  const reduce = useReducedMotion();

  const isEdgeActive = (e: Edge) => hover === null || hover === e.from || hover === e.to;

  return (
    <div className="not-prose my-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        Schéma en Y — survolez un acteur
      </p>
      <div className="mt-3 overflow-x-auto">
        <svg
          viewBox="0 0 720 440"
          className="w-full max-w-full"
          role="img"
          aria-label="Schéma des acteurs : émetteur, PA, annuaire DGFiP, récepteur"
        >
          {EDGES.map((e, i) => {
            const a = nodeById(e.from);
            const b = nodeById(e.to);
            const active = isEdgeActive(e);
            return (
              <g key={i}>
                <motion.line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={active ? "#0369A1" : "#CBD5E1"}
                  strokeWidth={active ? 2 : 1.2}
                  strokeDasharray="6 4"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : i * 0.1 }}
                />
                {active && e.label && (
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 6}
                    textAnchor="middle"
                    className="fill-[#0369A1]"
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {NODES.map((n) => {
            const active = hover === n.id;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                role="button"
                aria-label={`${n.label} — ${n.sub}`}
                style={{ cursor: "pointer", outline: "none" }}
              >
                <motion.rect
                  x={n.x - 70}
                  y={n.y - 26}
                  width={140}
                  height={52}
                  rx={10}
                  fill={active ? "#0369A1" : "#FFFFFF"}
                  stroke={active ? "#0369A1" : "#CBD5E1"}
                  strokeWidth={1.5}
                  animate={{ scale: active ? 1.05 : 1 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                />
                <text
                  x={n.x}
                  y={n.y - 4}
                  textAnchor="middle"
                  fill={active ? "#FFFFFF" : "#0F172A"}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y + 12}
                  textAnchor="middle"
                  fill={active ? "#E0F2FE" : "#64748B"}
                  style={{ fontSize: 10 }}
                >
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-[11px] text-[var(--color-muted-foreground)]">
        Le Y se dessine : les deux PA convergent vers l'Annuaire central DGFiP, qui centralise la donnée fiscale.
      </p>
    </div>
  );
}

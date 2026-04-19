import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, FileText, Layers, Tag } from "lucide-react";

type Node = {
  id: string;
  code: string;
  label: string;
  kind: "BG" | "BT";
  children?: Node[];
};

const TREE: Node = {
  id: "root",
  code: "Invoice",
  label: "Facture EN 16931",
  kind: "BG",
  children: [
    {
      id: "bg1",
      code: "BG-1",
      label: "Informations générales",
      kind: "BG",
      children: [
        { id: "bt1", code: "BT-1", label: "Numéro de facture", kind: "BT" },
        { id: "bt2", code: "BT-2", label: "Date d'émission", kind: "BT" },
        { id: "bt3", code: "BT-3", label: "Type de facture", kind: "BT" },
        { id: "bt5", code: "BT-5", label: "Devise", kind: "BT" },
      ],
    },
    {
      id: "bg4",
      code: "BG-4",
      label: "Vendeur (Seller)",
      kind: "BG",
      children: [
        { id: "bt27", code: "BT-27", label: "Nom du vendeur", kind: "BT" },
        { id: "bt30", code: "BT-30", label: "Identifiant légal", kind: "BT" },
        { id: "bt31", code: "BT-31", label: "Numéro TVA", kind: "BT" },
      ],
    },
    {
      id: "bg7",
      code: "BG-7",
      label: "Acheteur (Buyer)",
      kind: "BG",
      children: [
        { id: "bt44", code: "BT-44", label: "Nom de l'acheteur", kind: "BT" },
        { id: "bt47", code: "BT-47", label: "Identifiant légal", kind: "BT" },
        { id: "bt48", code: "BT-48", label: "Numéro TVA", kind: "BT" },
      ],
    },
    {
      id: "bg25",
      code: "BG-25",
      label: "Ligne de facture",
      kind: "BG",
      children: [
        { id: "bt126", code: "BT-126", label: "ID de ligne", kind: "BT" },
        { id: "bt129", code: "BT-129", label: "Quantité", kind: "BT" },
        { id: "bt131", code: "BT-131", label: "Montant net", kind: "BT" },
        { id: "bt153", code: "BT-153", label: "Désignation article", kind: "BT" },
      ],
    },
    {
      id: "bg22",
      code: "BG-22",
      label: "Totaux",
      kind: "BG",
      children: [
        { id: "bt106", code: "BT-106", label: "Total HT lignes", kind: "BT" },
        { id: "bt109", code: "BT-109", label: "Total HT facture", kind: "BT" },
        { id: "bt110", code: "BT-110", label: "Total TVA", kind: "BT" },
        { id: "bt112", code: "BT-112", label: "Total TTC", kind: "BT" },
      ],
    },
  ],
};

function NodeRow({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const reduce = useReducedMotion();
  const hasChildren = !!node.children?.length;
  const isBG = node.kind === "BG";

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        aria-expanded={hasChildren ? open : undefined}
        aria-label={`${node.code} ${node.label}`}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-violet-50"
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {hasChildren ? (
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            className="text-violet-600"
            aria-hidden
          >
            <ChevronRight size={14} />
          </motion.span>
        ) : (
          <span className="w-[14px]" aria-hidden />
        )}
        {isBG ? (
          <Layers size={14} className="text-violet-600" aria-hidden />
        ) : (
          <Tag size={14} className="text-sky-700" aria-hidden />
        )}
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
            isBG ? "bg-violet-100 text-violet-800" : "bg-sky-100 text-sky-800"
          }`}
        >
          {node.code}
        </span>
        <span className="text-sm text-slate-800">{node.label}</span>
      </button>
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22 }}
            className="overflow-hidden"
          >
            {node.children!.map((c) => (
              <NodeRow key={c.id} node={c} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EN16931Tree() {
  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Arborescence EN 16931 : groupes métier (BG) et termes métier (BT)"
    >
      <figcaption className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <FileText size={16} className="text-violet-600" aria-hidden />
        Modèle sémantique EN 16931 — BG (groupes) / BT (termes)
      </figcaption>
      <NodeRow node={TREE} />
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Layers size={12} className="text-violet-600" aria-hidden /> BG = Business Group
        </span>
        <span className="inline-flex items-center gap-1">
          <Tag size={12} className="text-sky-700" aria-hidden /> BT = Business Term
        </span>
      </div>
    </figure>
  );
}

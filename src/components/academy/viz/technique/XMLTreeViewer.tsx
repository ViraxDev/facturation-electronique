import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, Code2 } from "lucide-react";

type XNode = {
  tag: string;
  attrs?: Record<string, string>;
  text?: string;
  children?: XNode[];
  note?: string;
};

const XML: XNode = {
  tag: "rsm:CrossIndustryInvoice",
  attrs: { "xmlns:rsm": "urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" },
  children: [
    {
      tag: "rsm:ExchangedDocumentContext",
      note: "Profil Factur-X / EN 16931",
      children: [
        {
          tag: "ram:GuidelineSpecifiedDocumentContextParameter",
          children: [
            {
              tag: "ram:ID",
              text: "urn:cen.eu:en16931:2017",
              note: "Profil EN 16931",
            },
          ],
        },
      ],
    },
    {
      tag: "rsm:ExchangedDocument",
      note: "En-tête facture",
      children: [
        { tag: "ram:ID", text: "F-2026-001", note: "BT-1" },
        { tag: "ram:TypeCode", text: "380", note: "Facture commerciale" },
        {
          tag: "ram:IssueDateTime",
          children: [{ tag: "udt:DateTimeString", attrs: { format: "102" }, text: "20260915" }],
        },
      ],
    },
    {
      tag: "rsm:SupplyChainTradeTransaction",
      note: "Lignes + parties + totaux",
      children: [
        {
          tag: "ram:IncludedSupplyChainTradeLineItem",
          note: "BG-25 ligne",
          children: [
            {
              tag: "ram:AssociatedDocumentLineDocument",
              children: [{ tag: "ram:LineID", text: "1" }],
            },
            {
              tag: "ram:SpecifiedTradeProduct",
              children: [{ tag: "ram:Name", text: "Prestation conseil" }],
            },
          ],
        },
        {
          tag: "ram:ApplicableHeaderTradeSettlement",
          note: "Totaux & TVA",
          children: [
            {
              tag: "ram:SpecifiedTradeSettlementHeaderMonetarySummation",
              children: [
                { tag: "ram:TaxBasisTotalAmount", text: "1000.00" },
                { tag: "ram:TaxTotalAmount", attrs: { currencyID: "EUR" }, text: "200.00" },
                { tag: "ram:GrandTotalAmount", text: "1200.00", note: "BT-112" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function Line({ node, depth = 0 }: { node: XNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const reduce = useReducedMotion();
  const hasChildren = !!node.children?.length;
  const indent = depth * 14;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        aria-expanded={hasChildren ? open : undefined}
        aria-label={node.tag}
        className="flex w-full items-start gap-1.5 py-0.5 text-left font-mono text-[12px] leading-snug hover:bg-violet-50"
        style={{ paddingLeft: 6 + indent }}
      >
        {hasChildren ? (
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.18 }}
            className="mt-0.5 text-violet-600"
            aria-hidden
          >
            <ChevronRight size={12} />
          </motion.span>
        ) : (
          <span className="w-[12px]" aria-hidden />
        )}
        <span className="flex-1">
          <span className="text-slate-500">&lt;</span>
          <span className="text-violet-700">{node.tag}</span>
          {node.attrs &&
            Object.entries(node.attrs).map(([k, v]) => (
              <span key={k}>
                {" "}
                <span className="text-sky-700">{k}</span>
                <span className="text-slate-500">=</span>
                <span className="text-emerald-700">"{v}"</span>
              </span>
            ))}
          <span className="text-slate-500">{node.text || hasChildren ? ">" : " />"}</span>
          {node.text && <span className="text-slate-800"> {node.text} </span>}
          {node.text && (
            <>
              <span className="text-slate-500">&lt;/</span>
              <span className="text-violet-700">{node.tag}</span>
              <span className="text-slate-500">&gt;</span>
            </>
          )}
          {node.note && (
            <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-sans text-violet-800">
              {node.note}
            </span>
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children!.map((c, i) => (
              <Line key={i} node={c} depth={depth + 1} />
            ))}
            {hasChildren && (
              <div
                className="py-0.5 font-mono text-[12px] text-slate-500"
                style={{ paddingLeft: 6 + indent + 12 }}
              >
                &lt;/<span className="text-violet-700">{node.tag}</span>&gt;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function XMLTreeViewer() {
  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Arbre XML Factur-X dépliable"
    >
      <figcaption className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Code2 size={16} className="text-violet-600" aria-hidden />
        Anatomie d'un XML Factur-X (CII) — cliquer pour déplier
      </figcaption>
      <div className="rounded-md bg-slate-50 p-2">
        <Line node={XML} />
      </div>
    </figure>
  );
}

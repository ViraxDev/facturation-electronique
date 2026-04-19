import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FileText, Layers, Code2, Tag, RotateCw } from "lucide-react";

type Layer = {
  id: string;
  title: string;
  note: string;
  icon: typeof FileText;
  accent: string;
  body: React.ReactNode;
};

const LAYERS: Layer[] = [
  {
    id: "pdfa3",
    title: "PDF/A-3 (enveloppe)",
    note: "ISO 19005-3 — archivage, fontes embarquées",
    icon: FileText,
    accent: "#0F172A",
    body: (
      <div className="space-y-1 text-[11px] text-slate-600">
        <p className="font-semibold text-slate-800">FACTURE F-2026-001</p>
        <p>Vendeur : ACME SAS</p>
        <p>Acheteur : BETA SARL</p>
        <p>Total TTC : 1 200,00 EUR</p>
      </div>
    ),
  },
  {
    id: "xmp",
    title: "Métadonnées XMP",
    note: "fx:ConformanceLevel, fx:DocumentType",
    icon: Tag,
    accent: "#0369A1",
    body: (
      <pre className="text-[10px] leading-snug text-slate-700">{`<rdf:Description xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">
  <fx:DocumentType>INVOICE</fx:DocumentType>
  <fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>
  <fx:Version>1.0</fx:Version>
  <fx:ConformanceLevel>EN 16931</fx:ConformanceLevel>
</rdf:Description>`}</pre>
    ),
  },
  {
    id: "af",
    title: "/EmbeddedFiles + /AF",
    note: "AFRelationship = Alternative",
    icon: Layers,
    accent: "#7C3AED",
    body: (
      <pre className="text-[10px] leading-snug text-slate-700">{`<< /Type /Filespec
   /F (factur-x.xml)
   /AFRelationship /Alternative
   /EF << /F 42 0 R >> >>`}</pre>
    ),
  },
  {
    id: "xml",
    title: "factur-x.xml (CII)",
    note: "Charge utile structurée EN 16931",
    icon: Code2,
    accent: "#7C3AED",
    body: (
      <pre className="text-[10px] leading-snug text-slate-700">{`<rsm:CrossIndustryInvoice>
  <rsm:ExchangedDocument>
    <ram:ID>F-2026-001</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
  </rsm:ExchangedDocument>
</rsm:CrossIndustryInvoice>`}</pre>
    ),
  },
];

export default function FacturXExploded() {
  const [exploded, setExploded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/60 to-white p-4 shadow-sm"
      aria-label="Vue éclatée d'un fichier Factur-X : PDF/A-3 contenant un XML CII"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <figcaption className="text-sm font-semibold text-slate-700">
          Factur-X — vue éclatée PDF/A-3 + XML
        </figcaption>
        <button
          type="button"
          onClick={() => setExploded((v) => !v)}
          aria-pressed={exploded}
          className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
        >
          <RotateCw size={12} aria-hidden />
          {exploded ? "Recomposer" : "Éclater"}
        </button>
      </div>

      <div
        className="relative mx-auto flex h-[360px] w-full max-w-md items-center justify-center"
        style={{ perspective: 1400 }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            const offset = i - (LAYERS.length - 1) / 2;
            const targetZ = exploded ? offset * 90 : i * 2;
            const targetY = exploded ? offset * 14 : 0;
            const targetRot = exploded ? -18 : -2;
            return (
              <motion.div
                key={layer.id}
                initial={false}
                animate={
                  reduce
                    ? {}
                    : {
                        translateZ: targetZ,
                        translateY: targetY,
                        rotateY: targetRot,
                      }
                }
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-4 top-1/2 h-[180px] -translate-y-1/2 rounded-lg border bg-white/95 p-3 shadow-lg"
                style={{
                  borderColor: layer.accent,
                  transformStyle: "preserve-3d",
                  boxShadow: `0 8px 24px -8px ${layer.accent}44`,
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={14} style={{ color: layer.accent }} aria-hidden />
                  <span className="text-xs font-semibold" style={{ color: layer.accent }}>
                    {layer.title}
                  </span>
                </div>
                <p className="mb-2 text-[10px] uppercase tracking-wide text-slate-500">
                  {layer.note}
                </p>
                <div className="overflow-hidden">{layer.body}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        De haut en bas : enveloppe PDF visible → XMP → Associated Files → XML CII machine
      </p>
    </figure>
  );
}

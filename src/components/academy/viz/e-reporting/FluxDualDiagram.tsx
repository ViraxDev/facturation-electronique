import { motion, useReducedMotion } from "framer-motion";
import { FileText, Database, Building2, Users, Landmark } from "lucide-react";

const EMERALD = "#059669";
const ACCENT = "#0369A1";
const NAVY = "#0F172A";

export default function FluxDualDiagram() {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 3;

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Diagramme comparatif des deux flux : e-invoicing et e-reporting"
    >
      <figcaption className="mb-4 text-sm font-semibold text-slate-700">
        Deux flux parallèles : e-invoicing (facture structurée) vs e-reporting (données agrégées)
      </figcaption>
      <svg viewBox="0 0 640 260" className="h-auto w-full" role="img">
        <defs>
          <marker id="arrE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={EMERALD} />
          </marker>
          <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Top row: e-invoicing */}
        <g>
          <text x="20" y="30" fontSize="12" fontWeight="700" fill={NAVY}>E-invoicing (B2B domestique)</text>
          <rect x="20" y="50" width="120" height="50" rx="8" fill="#ECFDF5" stroke={EMERALD} />
          <text x="80" y="72" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>Fournisseur FR</text>
          <text x="80" y="88" textAnchor="middle" fontSize="10" fill="#475569">assujetti</text>

          <rect x="260" y="50" width="120" height="50" rx="8" fill="#ECFDF5" stroke={EMERALD} />
          <text x="320" y="72" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>PA / PPF</text>
          <text x="320" y="88" textAnchor="middle" fontSize="10" fill="#475569">facture structurée</text>

          <rect x="500" y="50" width="120" height="50" rx="8" fill="#ECFDF5" stroke={EMERALD} />
          <text x="560" y="72" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>Client FR</text>
          <text x="560" y="88" textAnchor="middle" fontSize="10" fill="#475569">assujetti</text>

          <line x1="140" y1="75" x2="260" y2="75" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrE)" />
          <line x1="380" y1="75" x2="500" y2="75" stroke={EMERALD} strokeWidth="2" markerEnd="url(#arrE)" />

          {!reduce && (
            <motion.circle
              r="6"
              fill={EMERALD}
              initial={{ cx: 140, cy: 75 }}
              animate={{ cx: [140, 260, 380, 500] }}
              transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
            />
          )}
        </g>

        {/* Bottom row: e-reporting */}
        <g>
          <text x="20" y="155" fontSize="12" fontWeight="700" fill={NAVY}>E-reporting (B2C, international, paiements)</text>
          <rect x="20" y="175" width="120" height="50" rx="8" fill="#F0F9FF" stroke={ACCENT} />
          <text x="80" y="197" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>Entreprise FR</text>
          <text x="80" y="213" textAnchor="middle" fontSize="10" fill="#475569">assujettie</text>

          <rect x="260" y="175" width="120" height="50" rx="8" fill="#F0F9FF" stroke={ACCENT} />
          <text x="320" y="197" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>PA / PPF</text>
          <text x="320" y="213" textAnchor="middle" fontSize="10" fill="#475569">données agrégées</text>

          <rect x="500" y="175" width="120" height="50" rx="8" fill="#F0F9FF" stroke={ACCENT} />
          <text x="560" y="197" textAnchor="middle" fontSize="11" fontWeight="600" fill={NAVY}>DGFiP</text>
          <text x="560" y="213" textAnchor="middle" fontSize="10" fill="#475569">pré-remplissage TVA</text>

          <line x1="140" y1="200" x2="260" y2="200" stroke={ACCENT} strokeWidth="2" markerEnd="url(#arrA)" />
          <line x1="380" y1="200" x2="500" y2="200" stroke={ACCENT} strokeWidth="2" markerEnd="url(#arrA)" />

          {!reduce && (
            <motion.circle
              r="6"
              fill={ACCENT}
              initial={{ cx: 140, cy: 200 }}
              animate={{ cx: [140, 260, 380, 500] }}
              transition={{ duration: dur, repeat: Infinity, ease: "linear", delay: 0.6 }}
            />
          )}
        </g>
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-slate-700">
          <FileText size={16} className="mt-0.5 text-emerald-700" aria-hidden />
          <span><strong>E-invoicing</strong> transporte la <em>facture</em> entre deux assujettis français.</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-sm text-slate-700">
          <Database size={16} className="mt-0.5 text-sky-700" aria-hidden />
          <span><strong>E-reporting</strong> transporte des <em>données fiscales</em> vers la DGFiP.</span>
        </div>
      </div>
      <div className="sr-only">
        <Building2 aria-hidden /> <Users aria-hidden /> <Landmark aria-hidden />
      </div>
    </figure>
  );
}

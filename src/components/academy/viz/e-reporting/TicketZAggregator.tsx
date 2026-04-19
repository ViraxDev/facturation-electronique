import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Receipt, Package } from "lucide-react";

const EMERALD = "#059669";

type Ticket = { id: number; ht: number; rate: 5.5 | 10 | 20 };
const TICKETS: Ticket[] = [
  { id: 1, ht: 12.5, rate: 10 },
  { id: 2, ht: 28, rate: 10 },
  { id: 3, ht: 6.2, rate: 20 },
  { id: 4, ht: 18.9, rate: 10 },
  { id: 5, ht: 3.5, rate: 5.5 },
  { id: 6, ht: 45, rate: 20 },
  { id: 7, ht: 14, rate: 10 },
  { id: 8, ht: 9.5, rate: 5.5 },
];

export default function TicketZAggregator() {
  const reduce = useReducedMotion();
  const [aggregated, setAggregated] = useState(false);

  const totals = TICKETS.reduce(
    (acc, t) => {
      acc[t.rate] = (acc[t.rate] ?? 0) + t.ht;
      return acc;
    },
    {} as Record<number, number>
  );
  const count = TICKETS.length;

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Agrégation B2C : tickets individuels vers ticket Z"
    >
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>Tickets individuels agrégés en un ticket Z journalier (transmis à la PA)</span>
        <button
          type="button"
          onClick={() => setAggregated(a => !a)}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          aria-pressed={aggregated}
        >
          {aggregated ? "Voir les tickets" : "Clôturer le Z"}
        </button>
      </figcaption>

      <div className="relative min-h-[180px]">
        <AnimatePresence mode="wait">
          {!aggregated ? (
            <motion.div
              key="tickets"
              className="flex flex-wrap gap-2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              {TICKETS.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={reduce ? false : { y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduce ? 0 : i * 0.05 }}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs"
                >
                  <Receipt size={12} aria-hidden className="text-slate-500" />
                  <span className="font-mono">{t.ht.toFixed(2)} €</span>
                  <span className="text-slate-500">@ {t.rate}%</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="z"
              initial={reduce ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="rounded-lg border-2 border-emerald-600 bg-emerald-50 p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-emerald-800">
                <Package size={18} aria-hidden />
                <strong>Ticket Z — {count} transactions</strong>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-1">Taux</th>
                    <th className="py-1">HT</th>
                    <th className="py-1">TVA</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totals).map(([rate, ht]) => (
                    <tr key={rate} className="border-t border-emerald-200">
                      <td className="py-1 font-mono">{rate}%</td>
                      <td className="py-1 font-mono">{ht.toFixed(2)} €</td>
                      <td className="py-1 font-mono">{((ht * Number(rate)) / 100).toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-slate-600">
                Seules ces lignes agrégées sont transmises — aucune donnée nominative.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Couleur <span style={{ color: EMERALD }} className="font-semibold">emerald</span> : parcours e-reporting.
      </div>
    </figure>
  );
}

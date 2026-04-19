import { useState, useEffect, useMemo } from "react";
import { markToolUsed } from "@/stores/progression";

function formatEUR(n: number) { return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }); }

export default function ROICalculator() {
  const [clients, setClients] = useState(150);
  const [tauxEquip, setTauxEquip] = useState(60);
  const [prixMensuel, setPrixMensuel] = useState(25);
  const [setupFee, setSetupFee] = useState(150);

  useEffect(() => { markToolUsed("roi-cabinet"); }, []);

  const { clientsEquipes, revenusRecurrents, revenusSetup, revenuAn1, revenuAn3 } = useMemo(() => {
    const ce = Math.round((clients * tauxEquip) / 100);
    const rr = ce * prixMensuel * 12;
    const rs = ce * setupFee;
    return { clientsEquipes: ce, revenusRecurrents: rr, revenusSetup: rs, revenuAn1: rr + rs, revenuAn3: rr * 3 + rs };
  }, [clients, tauxEquip, prixMensuel, setupFee]);

  const Slider = ({ label, value, min, max, step, onChange, suffix }: { label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; suffix?: string }) => (
    <div>
      <label className="flex items-center justify-between text-sm font-medium mb-2">
        <span>{label}</span>
        <span className="tabular text-[var(--color-accent)] font-bold">{value}{suffix}</span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Paramètres</h3>
        <Slider label="Nombre de clients TPE/PME" value={clients} min={10} max={1000} step={10} onChange={setClients} />
        <Slider label="Taux d'équipement visé" value={tauxEquip} min={10} max={100} step={5} onChange={setTauxEquip} suffix=" %" />
        <Slider label="Prix mensuel par client" value={prixMensuel} min={10} max={100} step={5} onChange={setPrixMensuel} suffix=" €" />
        <Slider label="Frais de setup (one-shot)" value={setupFee} min={0} max={500} step={25} onChange={setSetupFee} suffix=" €" />
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-sky-50 to-white p-6">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Projection cabinet</h3>
        <dl className="mt-6 space-y-4">
          <div className="flex items-baseline justify-between"><dt className="text-sm text-[var(--color-muted-foreground)]">Clients équipés</dt><dd className="text-2xl font-bold tabular">{clientsEquipes}</dd></div>
          <div className="flex items-baseline justify-between"><dt className="text-sm text-[var(--color-muted-foreground)]">Revenus récurrents / an</dt><dd className="text-2xl font-bold tabular">{formatEUR(revenusRecurrents)}</dd></div>
          <div className="flex items-baseline justify-between"><dt className="text-sm text-[var(--color-muted-foreground)]">Revenus setup</dt><dd className="text-lg font-semibold tabular">{formatEUR(revenusSetup)}</dd></div>
          <div className="pt-4 border-t border-[var(--color-border)] flex items-baseline justify-between"><dt className="text-sm font-semibold">Revenu année 1</dt><dd className="text-3xl font-bold tabular text-[var(--color-accent)]">{formatEUR(revenuAn1)}</dd></div>
          <div className="flex items-baseline justify-between"><dt className="text-sm font-semibold">Revenu cumulé 3 ans</dt><dd className="text-3xl font-bold tabular text-emerald-700">{formatEUR(revenuAn3)}</dd></div>
        </dl>
      </div>
    </div>
  );
}

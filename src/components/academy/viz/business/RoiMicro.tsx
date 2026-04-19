import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { Users, Percent, Banknote, TrendingUp } from "lucide-react";

function useAnimatedNumber(value: number, duration = 0.6) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(display, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce]);
  return display;
}

function euros(n: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

type SliderProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  suffix: string;
};

function Slider({ id, label, icon, min, max, step, value, onChange, suffix }: SliderProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-3">
      <label htmlFor={id} className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0369A1]">
          {icon}
          {label}
        </span>
        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-sm font-semibold text-amber-700 tabular-nums">
          {value.toLocaleString("fr-FR")}
          {suffix}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 w-full accent-amber-500"
      />
      <div className="mt-1 flex justify-between text-[10px] tabular-nums text-[var(--color-muted-foreground)]">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default function RoiMicro() {
  const [clients, setClients] = useState(250);
  const [equip, setEquip] = useState(40);
  const [price, setPrice] = useState(55);
  const [setupFee, setSetupFee] = useState(900);

  const equipped = Math.round((clients * equip) / 100);
  const annualRecurring = equipped * price * 12;
  const setupRevenue = equipped * setupFee;
  const year1 = annualRecurring + setupRevenue;
  const year2plus = annualRecurring;
  const margin = Math.round(annualRecurring * 0.45);

  const aRec = useAnimatedNumber(annualRecurring);
  const aSetup = useAnimatedNumber(setupRevenue);
  const aY1 = useAnimatedNumber(year1);
  const aMargin = useAnimatedNumber(margin);
  const aEquipped = useAnimatedNumber(equipped);

  const maxBar = useMemo(() => Math.max(year1, year2plus, 1), [year1, year2plus]);

  return (
    <div
      className="not-prose my-6 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-amber-50/40 to-white p-5 shadow-sm"
      aria-label="Calculateur de ROI cabinet"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0369A1]">
            Calculateur ROI cabinet
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Ajustez les curseurs pour projeter le CA récurrent annuel généré.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          Projection
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Slider
          id="roi-clients"
          label="Clients du cabinet"
          icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}
          min={50}
          max={800}
          step={10}
          value={clients}
          onChange={setClients}
          suffix=""
        />
        <Slider
          id="roi-equip"
          label="Taux d'équipement"
          icon={<Percent className="h-3.5 w-3.5" aria-hidden="true" />}
          min={10}
          max={80}
          step={5}
          value={equip}
          onChange={setEquip}
          suffix=" %"
        />
        <Slider
          id="roi-price"
          label="Prix mensuel / client"
          icon={<Banknote className="h-3.5 w-3.5" aria-hidden="true" />}
          min={30}
          max={90}
          step={5}
          value={price}
          onChange={setPrice}
          suffix=" €"
        />
        <Slider
          id="roi-setup"
          label="Forfait setup moyen"
          icon={<Banknote className="h-3.5 w-3.5" aria-hidden="true" />}
          min={500}
          max={2500}
          step={100}
          value={setupFee}
          onChange={setSetupFee}
          suffix=" €"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-white p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Clients équipés
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-[#0F172A]">
            {Math.round(aEquipped).toLocaleString("fr-FR")}
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Récurrent annuel
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-amber-700">
            {euros(aRec)} €
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Marge nette est. (45 %)
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-[#0369A1]">
            {euros(aMargin)} €
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
          Projection CA par année
        </div>
        <div className="space-y-3">
          <BarRow
            label="Année 1 (setup + récurrent)"
            value={aY1}
            rawValue={year1}
            max={maxBar}
            tone="amber"
            breakdown={`${euros(aSetup)} € setup + ${euros(aRec)} € récurrent`}
          />
          <BarRow
            label="Année 2+ (récurrent seul)"
            value={aRec}
            rawValue={year2plus}
            max={maxBar}
            tone="sky"
          />
        </div>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  rawValue,
  max,
  tone,
  breakdown,
}: {
  label: string;
  value: number;
  rawValue: number;
  max: number;
  tone: "amber" | "sky";
  breakdown?: string;
}) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, (rawValue / max) * 100);
  const gradient =
    tone === "amber"
      ? "from-amber-400 to-orange-500"
      : "from-sky-400 to-[#0369A1]";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-[#0F172A]">{label}</span>
        <span className="font-semibold tabular-nums text-[#0F172A]">
          {euros(value)} €
        </span>
      </div>
      <div className="relative mt-1 h-4 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
        />
      </div>
      {breakdown ? (
        <div className="mt-1 text-[10px] tabular-nums text-[var(--color-muted-foreground)]">
          {breakdown}
        </div>
      ) : null}
    </div>
  );
}

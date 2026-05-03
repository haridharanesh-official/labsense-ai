import { Thermometer, Droplets, Wind, Activity, Sun } from "lucide-react";
import type { SensorReading } from "@/lib/labStore";
import { cn } from "@/lib/utils";

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  gas: Wind,
  motion: Activity,
  light: Sun,
};

export function SensorTile({ sensor }: { sensor: SensorReading }) {
  const Icon = iconMap[sensor.kind];
  const statusColor =
    sensor.status === "danger"
      ? "text-destructive border-destructive/40 bg-destructive/10"
      : sensor.status === "warning"
        ? "text-warning border-warning/40 bg-warning/10"
        : "text-success border-success/30 bg-success/10";

  const display =
    sensor.kind === "motion" ? (sensor.value ? "Detected" : "Clear") : `${sensor.value}${sensor.unit ? " " + sensor.unit : ""}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40 hover:shadow-elegant">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider", statusColor)}>
          {sensor.status}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">{sensor.name}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">{display}</p>
      </div>
    </div>
  );
}
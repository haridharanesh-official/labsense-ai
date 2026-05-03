import { Lightbulb, Fan, Wind, Power, Bell } from "lucide-react";
import type { Device } from "@/lib/labStore";
import { useLabStore } from "@/lib/labStore";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const iconMap = {
  light: Lightbulb,
  fan: Fan,
  exhaust: Wind,
  power: Power,
  buzzer: Bell,
};

export function DeviceCard({ device }: { device: Device }) {
  const toggle = useLabStore((s) => s.toggleDevice);
  const Icon = iconMap[device.kind];
  const isAlarm = device.kind === "buzzer" && device.on;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-gradient-card p-4 transition",
        device.on ? "border-primary/50 shadow-glow" : "border-border hover:border-primary/30",
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition",
            device.on ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            isAlarm && "animate-pulse-danger",
            device.on && device.kind === "fan" && "[&>svg]:animate-spin",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <Switch checked={device.on} onCheckedChange={() => toggle(device.id)} />
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium">{device.name}</p>
        <p className="text-xs text-muted-foreground">{device.on ? "Active" : "Off"}</p>
      </div>
    </div>
  );
}
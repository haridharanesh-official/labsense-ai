import { useLabStore } from "@/lib/labStore";
import { SensorTile } from "@/components/lab/SensorTile";
import { DeviceCard } from "@/components/lab/DeviceCard";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Cpu, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Overview() {
  const { rooms, sensors, devices, alerts, triggerEmergency } = useLabStore();
  const activeDevices = devices.filter((d) => d.on).length;
  const dangerSensors = sensors.filter((s) => s.status === "danger").length;
  const openAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* KPI bento header */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Rooms online" value={rooms.length} icon={<Cpu className="h-4 w-4" />} />
        <Stat label="Active devices" value={activeDevices} icon={<Zap className="h-4 w-4" />} />
        <Stat label="Open alerts" value={openAlerts} icon={<AlertTriangle className="h-4 w-4" />} accent={openAlerts > 0} />
        <Stat label="Danger sensors" value={dangerSensors} icon={<ShieldAlert className="h-4 w-4" />} accent={dangerSensors > 0} />
      </section>

      {rooms.map((room) => {
        const roomSensors = sensors.filter((s) => s.roomId === room.id);
        const roomDevices = devices.filter((d) => d.roomId === room.id);
        const danger = roomSensors.some((s) => s.status === "danger");
        return (
          <section
            key={room.id}
            className="rounded-3xl border border-border bg-gradient-card p-5 shadow-elegant"
          >
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{room.code}</p>
                <h2 className="text-xl font-bold tracking-tight">{room.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                {danger && (
                  <span className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive animate-pulse-danger">
                    <ShieldAlert className="h-3 w-3" /> Hazard
                  </span>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => triggerEmergency(room.id)}
                  className="gap-1.5"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> Simulate gas leak
                </Button>
              </div>
            </header>

            <div className="grid gap-3 md:grid-cols-5">
              {roomSensors.map((s) => (
                <SensorTile key={s.id} sensor={s} />
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {roomDevices.map((d) => (
                <DeviceCard key={d.id} device={d} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
        Need to wire this up to a real Raspberry Pi? Connect{" "}
        <Link to="/addons" className="text-primary underline-offset-4 hover:underline">
          Add-ons
        </Link>{" "}
        to enable the MQTT bridge.
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-card p-4 ${
        accent ? "border-destructive/40 shadow-elegant" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase tracking-widest">{label}</span>
        <span className={accent ? "text-destructive" : ""}>{icon}</span>
      </div>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent ? "text-destructive" : ""}`}>{value}</p>
    </div>
  );
}
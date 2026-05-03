import { useLabStore } from "@/lib/labStore";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, ShieldAlert, Check } from "lucide-react";

const levelMap = {
  info: { icon: Info, cls: "border-primary/30 bg-primary/5 text-primary" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/10 text-warning" },
  danger: { icon: ShieldAlert, cls: "border-destructive/40 bg-destructive/10 text-destructive" },
};

export default function Alerts() {
  const { alerts, rooms, ackAlert } = useLabStore();
  if (alerts.length === 0) {
    return <p className="text-muted-foreground">No alerts. Everything looks calm.</p>;
  }
  return (
    <div className="space-y-3">
      {alerts.map((a) => {
        const { icon: Icon, cls } = levelMap[a.level];
        const room = rooms.find((r) => r.id === a.roomId);
        return (
          <div key={a.id} className={`flex items-start gap-3 rounded-2xl border bg-gradient-card p-4 ${a.acknowledged ? "opacity-60" : ""}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cls}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{a.message}</p>
              <p className="text-xs text-muted-foreground">
                {room?.code} · {new Date(a.ts).toLocaleString()}
              </p>
            </div>
            {!a.acknowledged && (
              <Button size="sm" variant="secondary" onClick={() => ackAlert(a.id)} className="gap-1.5">
                <Check className="h-3.5 w-3.5" /> Acknowledge
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
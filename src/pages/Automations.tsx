import { useLabStore } from "@/lib/labStore";
import { Switch } from "@/components/ui/switch";
import { Workflow } from "lucide-react";

export default function Automations() {
  const { automations, toggleAutomation } = useLabStore();
  return (
    <div className="space-y-3">
      {automations.map((a) => (
        <div
          key={a.id}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/30"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.enabled ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"}`}>
            <Workflow className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="font-medium">{a.name}</p>
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground/80">When</span> {a.trigger}{" "}
              <span className="text-foreground/80">→ Do</span> {a.action}
            </p>
          </div>
          <Switch checked={a.enabled} onCheckedChange={() => toggleAutomation(a.id)} />
        </div>
      ))}
    </div>
  );
}
import { useLabStore } from "@/lib/labStore";
import { Camera, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const sevMap = {
  info: { icon: Info, cls: "border-primary/40 bg-primary/10 text-primary", dot: "bg-primary" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/10 text-warning", dot: "bg-warning" },
  danger: { icon: ShieldAlert, cls: "border-destructive/40 bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

export default function CameraEvents() {
  const { cameraEvents, rooms } = useLabStore();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-gradient-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Camera Feed</p>
            <h2 className="text-lg font-bold">Detection Timeline</h2>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {cameraEvents.length} event{cameraEvents.length === 1 ? "" : "s"} captured
          </div>
        </div>
      </div>

      {cameraEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No camera detections yet. Events will appear here as soon as motion is detected on any feed.
        </p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-6">
          {cameraEvents.map((e) => {
            const room = rooms.find((r) => r.id === e.roomId);
            const { icon: Icon, cls, dot } = sevMap[e.severity];
            return (
              <li key={e.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] top-2 flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background",
                    dot,
                  )}
                />
                <div className={cn("flex items-start gap-3 rounded-2xl border bg-gradient-card p-4", cls)}>
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", cls)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{e.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {room?.code} · {new Date(e.ts).toLocaleString()}
                    </p>
                  </div>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider", cls)}>
                    {e.severity}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
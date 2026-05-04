import { useMemo, useState } from "react";
import { useLabStore } from "@/lib/labStore";
import { Camera, Info, AlertTriangle, ShieldAlert, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sevMap = {
  info: { icon: Info, cls: "border-primary/40 bg-primary/10 text-primary", dot: "bg-primary" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/10 text-warning", dot: "bg-warning" },
  danger: { icon: ShieldAlert, cls: "border-destructive/40 bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

const RANGES: { value: string; label: string; ms: number | null }[] = [
  { value: "all", label: "All time", ms: null },
  { value: "15m", label: "Last 15 minutes", ms: 15 * 60 * 1000 },
  { value: "1h", label: "Last hour", ms: 60 * 60 * 1000 },
  { value: "24h", label: "Last 24 hours", ms: 24 * 60 * 60 * 1000 },
  { value: "7d", label: "Last 7 days", ms: 7 * 24 * 60 * 60 * 1000 },
];

export default function CameraEvents() {
  const { cameraEvents, rooms } = useLabStore();
  const [room, setRoom] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [range, setRange] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const rangeMs = RANGES.find((r) => r.value === range)?.ms ?? null;
    const cutoff = rangeMs ? Date.now() - rangeMs : null;
    const q = query.trim().toLowerCase();
    return cameraEvents.filter((e) => {
      if (room !== "all" && e.roomId !== room) return false;
      if (severity !== "all" && e.severity !== severity) return false;
      if (cutoff && e.ts < cutoff) return false;
      if (q && !e.message.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [cameraEvents, room, severity, range, query]);

  const clearFilters = () => {
    setRoom("all");
    setSeverity("all");
    setRange("all");
    setQuery("");
  };

  const hasFilters = room !== "all" || severity !== "all" || range !== "all" || query.length > 0;

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
            {filtered.length} of {cameraEvents.length} event{cameraEvents.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={room} onValueChange={setRoom}>
            <SelectTrigger><SelectValue placeholder="Room" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rooms</SelectItem>
              {rooms.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.code} · {r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="danger">Danger</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger><SelectValue placeholder="Time range" /></SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-muted-foreground">
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {cameraEvents.length === 0
            ? "No camera detections yet. Events will appear here as soon as the camera reports occupancy changes."
            : "No events match the current filters."}
        </p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-6">
          {filtered.map((e) => {
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
                      {room?.code} · {new Date(e.ts).toLocaleString()} · {e.peopleCount} occupant{e.peopleCount === 1 ? "" : "s"}
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
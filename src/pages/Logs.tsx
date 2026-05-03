import { useLabStore } from "@/lib/labStore";

export default function Logs() {
  const logs = useLabStore((s) => s.logs);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Time</th>
            <th className="px-4 py-3 text-left">Topic</th>
            <th className="px-4 py-3 text-left">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-t border-border/60 hover:bg-secondary/30">
              <td className="px-4 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">
                {new Date(l.ts).toLocaleTimeString()}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-primary">{l.source}</td>
              <td className="px-4 py-2.5">{l.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
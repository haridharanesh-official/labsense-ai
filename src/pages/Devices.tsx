import { useLabStore } from "@/lib/labStore";
import { DeviceCard } from "@/components/lab/DeviceCard";

export default function Devices() {
  const { rooms, devices } = useLabStore();
  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <section key={room.id} className="rounded-3xl border border-border bg-gradient-card p-5">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{room.code}</p>
            <h2 className="text-lg font-bold">{room.name}</h2>
          </header>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {devices.filter((d) => d.roomId === room.id).map((d) => (
              <DeviceCard key={d.id} device={d} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
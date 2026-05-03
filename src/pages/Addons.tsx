import { Cpu, Workflow, Bot, Camera, Database, Radio } from "lucide-react";

const addons = [
  { name: "Mosquitto MQTT", desc: "Lightweight broker for ESP32 nodes.", icon: Radio, status: "Running" },
  { name: "Node-RED", desc: "Visual flow-based automation engine.", icon: Workflow, status: "Running" },
  { name: "SQLite Logger", desc: "Persistent sensor history & events.", icon: Database, status: "Running" },
  { name: "Ollama AI", desc: "Local LLM assistant (Mistral, Llama 3).", icon: Bot, status: "Available" },
  { name: "Frigate Camera", desc: "Optional face & motion detection.", icon: Camera, status: "Available" },
  { name: "ESP32 OTA", desc: "Over-the-air firmware updates.", icon: Cpu, status: "Available" },
];

export default function Addons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {addons.map((a) => (
        <div key={a.name} className="rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40 hover:shadow-elegant">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <a.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className={`text-xs ${a.status === "Running" ? "text-success" : "text-muted-foreground"}`}>
                ● {a.status}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{a.desc}</p>
        </div>
      ))}
    </div>
  );
}
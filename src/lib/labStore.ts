import { create } from "zustand";

export type DeviceKind = "light" | "fan" | "exhaust" | "power" | "buzzer";
export type SensorKind = "temperature" | "humidity" | "gas" | "motion" | "light";

export interface Device {
  id: string;
  roomId: string;
  name: string;
  kind: DeviceKind;
  on: boolean;
}

export interface SensorReading {
  id: string;
  roomId: string;
  name: string;
  kind: SensorKind;
  value: number;
  unit: string;
  status: "normal" | "warning" | "danger";
}

export interface Room {
  id: string;
  name: string;
  code: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  ts: number;
  roomId: string;
  level: "info" | "warning" | "danger";
  message: string;
  acknowledged: boolean;
}

export interface LogEntry {
  id: string;
  ts: number;
  source: string;
  message: string;
}

interface LabState {
  rooms: Room[];
  devices: Device[];
  sensors: SensorReading[];
  automations: Automation[];
  alerts: Alert[];
  logs: LogEntry[];
  toggleDevice: (id: string) => void;
  toggleAutomation: (id: string) => void;
  ackAlert: (id: string) => void;
  tick: () => void;
  triggerEmergency: (roomId: string) => void;
}

const rooms: Room[] = [
  { id: "r101", name: "Chemistry Lab", code: "Lab 101" },
  { id: "r102", name: "Biology Lab", code: "Lab 102" },
  { id: "r103", name: "Electronics Lab", code: "Lab 103" },
];

const initialDevices: Device[] = rooms.flatMap((r) => [
  { id: `${r.id}-light`, roomId: r.id, name: "Ceiling Lights", kind: "light", on: true },
  { id: `${r.id}-fan`, roomId: r.id, name: "Ceiling Fan", kind: "fan", on: false },
  { id: `${r.id}-exhaust`, roomId: r.id, name: "Exhaust Fan", kind: "exhaust", on: false },
  { id: `${r.id}-power`, roomId: r.id, name: "Main Power", kind: "power", on: true },
  { id: `${r.id}-buzzer`, roomId: r.id, name: "Emergency Buzzer", kind: "buzzer", on: false },
]);

const initialSensors: SensorReading[] = rooms.flatMap((r) => [
  { id: `${r.id}-temp`, roomId: r.id, name: "Temperature", kind: "temperature", value: 24, unit: "°C", status: "normal" },
  { id: `${r.id}-hum`, roomId: r.id, name: "Humidity", kind: "humidity", value: 48, unit: "%", status: "normal" },
  { id: `${r.id}-gas`, roomId: r.id, name: "Gas (MQ2)", kind: "gas", value: 120, unit: "ppm", status: "normal" },
  { id: `${r.id}-pir`, roomId: r.id, name: "Motion", kind: "motion", value: 0, unit: "", status: "normal" },
  { id: `${r.id}-ldr`, roomId: r.id, name: "Ambient Light", kind: "light", value: 420, unit: "lx", status: "normal" },
]);

const automations: Automation[] = [
  { id: "a1", name: "Gas Leak Emergency", trigger: "Gas > 600 ppm", action: "Exhaust ON · Power OFF · Buzzer ON", enabled: true },
  { id: "a2", name: "Auto Lights at Dusk", trigger: "Ambient < 200 lx", action: "Lights ON", enabled: true },
  { id: "a3", name: "Temperature Cooling", trigger: "Temp > 30 °C", action: "Fan ON", enabled: true },
  { id: "a4", name: "Motion Auto-Off", trigger: "No motion 10 min", action: "Lights OFF", enabled: false },
  { id: "a5", name: "After-Hours Lockdown", trigger: "Time > 22:00", action: "Power OFF · Lights OFF", enabled: true },
];

const initialAlerts: Alert[] = [
  { id: "al1", ts: Date.now() - 1000 * 60 * 12, roomId: "r102", level: "warning", message: "Humidity above 65% threshold", acknowledged: false },
  { id: "al2", ts: Date.now() - 1000 * 60 * 90, roomId: "r101", level: "info", message: "Motion detected after-hours", acknowledged: true },
];

const initialLogs: LogEntry[] = [
  { id: "l1", ts: Date.now() - 1000 * 60 * 2, source: "lab/r101/light", message: "Ceiling Lights turned ON" },
  { id: "l2", ts: Date.now() - 1000 * 60 * 5, source: "lab/r103/sensor/temp", message: "Temperature reading 25.3 °C" },
  { id: "l3", ts: Date.now() - 1000 * 60 * 8, source: "automation/a3", message: "Triggered: Temperature Cooling" },
  { id: "l4", ts: Date.now() - 1000 * 60 * 14, source: "lab/r102/sensor/gas", message: "Gas reading 130 ppm" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

function classifySensor(s: SensorReading): SensorReading["status"] {
  if (s.kind === "gas") return s.value > 600 ? "danger" : s.value > 350 ? "warning" : "normal";
  if (s.kind === "temperature") return s.value > 32 ? "danger" : s.value > 28 ? "warning" : "normal";
  if (s.kind === "humidity") return s.value > 70 ? "warning" : "normal";
  return "normal";
}

export const useLabStore = create<LabState>((set, get) => ({
  rooms,
  devices: initialDevices,
  sensors: initialSensors,
  automations,
  alerts: initialAlerts,
  logs: initialLogs,
  toggleDevice: (id) =>
    set((state) => {
      const dev = state.devices.find((d) => d.id === id);
      if (!dev) return state;
      const updated = state.devices.map((d) => (d.id === id ? { ...d, on: !d.on } : d));
      const log: LogEntry = {
        id: uid(),
        ts: Date.now(),
        source: `lab/${dev.roomId}/${dev.kind}`,
        message: `${dev.name} turned ${!dev.on ? "ON" : "OFF"}`,
      };
      return { devices: updated, logs: [log, ...state.logs].slice(0, 200) };
    }),
  toggleAutomation: (id) =>
    set((state) => ({
      automations: state.automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    })),
  ackAlert: (id) =>
    set((state) => ({ alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),
  tick: () =>
    set((state) => {
      const sensors = state.sensors.map((s) => {
        let v = s.value;
        if (s.kind === "temperature") v = +(v + (Math.random() - 0.5) * 0.4).toFixed(1);
        else if (s.kind === "humidity") v = +(v + (Math.random() - 0.5) * 1.2).toFixed(0);
        else if (s.kind === "gas") v = Math.max(80, Math.round(v + (Math.random() - 0.5) * 30));
        else if (s.kind === "motion") v = Math.random() > 0.85 ? 1 : 0;
        else if (s.kind === "light") v = Math.max(50, Math.round(v + (Math.random() - 0.5) * 40));
        const next = { ...s, value: v };
        next.status = classifySensor(next);
        return next;
      });
      return { sensors };
    }),
  triggerEmergency: (roomId) =>
    set((state) => {
      const devices = state.devices.map((d) => {
        if (d.roomId !== roomId) return d;
        if (d.kind === "exhaust" || d.kind === "buzzer") return { ...d, on: true };
        if (d.kind === "power") return { ...d, on: false };
        return d;
      });
      const sensors = state.sensors.map((s) =>
        s.roomId === roomId && s.kind === "gas" ? { ...s, value: 720, status: "danger" as const } : s,
      );
      const room = state.rooms.find((r) => r.id === roomId);
      const alert: Alert = {
        id: uid(),
        ts: Date.now(),
        roomId,
        level: "danger",
        message: `Gas leak detected in ${room?.code} — emergency protocol engaged`,
        acknowledged: false,
      };
      const log: LogEntry = {
        id: uid(),
        ts: Date.now(),
        source: `automation/a1`,
        message: `Triggered: Gas Leak Emergency in ${room?.code}`,
      };
      return {
        devices,
        sensors,
        alerts: [alert, ...state.alerts],
        logs: [log, ...state.logs].slice(0, 200),
      };
    }),
}));

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLabStore } from "@/lib/labStore";
import { Activity } from "lucide-react";

const titles: Record<string, string> = {
  "/": "Lab Overview",
  "/devices": "Devices",
  "/automations": "Automations",
  "/alerts": "Alerts",
  "/logs": "Activity Logs",
  "/addons": "Add-ons",
};

export default function Layout() {
  const tick = useLabStore((s) => s.tick);
  const { pathname } = useLocation();

  useEffect(() => {
    const id = setInterval(tick, 2500);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger className="text-foreground" />
            <div className="flex-1">
              <h1 className="text-base font-semibold tracking-tight">{titles[pathname] ?? "LabOS"}</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <Activity className="h-3 w-3" />
              MQTT online
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in-up">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
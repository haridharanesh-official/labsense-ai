import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Cpu, Workflow, AlertTriangle, ScrollText, Puzzle, FlaskConical } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLabStore } from "@/lib/labStore";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Devices", url: "/devices", icon: Cpu },
  { title: "Automations", url: "/automations", icon: Workflow },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Logs", url: "/logs", icon: ScrollText },
  { title: "Add-ons", url: "/addons", icon: Puzzle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const alerts = useLabStore((s) => s.alerts.filter((a) => !a.acknowledged).length);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <FlaskConical className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">LabOS</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Lab Control</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            {item.title}
                            {item.title === "Alerts" && alerts > 0 && (
                              <span className="ml-auto rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
                                {alerts}
                              </span>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
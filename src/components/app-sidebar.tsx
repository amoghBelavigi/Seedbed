"use client";

import { cn } from "@/lib/utils";
import {
  Brain,
  Rocket,
  Trophy,
  Sprout,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Brain Box Arena", icon: Brain, id: "brainbox" },
  { label: "Launch Pad", icon: Rocket, id: "launchpad" },
  { label: "Trophy Case", icon: Trophy, id: "trophycase" },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-200",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Sprout className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-[family-name:var(--font-space-grotesk)] text-[15px] font-bold tracking-tight">
            Seedbed
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            
          </p>
        )}
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: collapse toggle */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={onToggleCollapse}
        >
          <PanelLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>
    </aside>
  );
}

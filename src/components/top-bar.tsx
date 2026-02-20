"use client";

import { Search, Bell, Plus, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface TopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onNewIdea: () => void;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TopBar({ searchValue, onSearchChange, onNewIdea, activeTab, onTabChange }: TopBarProps) {
  return (
    <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
      {/* Dashboard button */}
      <button
        onClick={() => onTabChange("dashboard")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
          activeTab === "dashboard"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <LayoutDashboard className={cn("h-4 w-4", activeTab === "dashboard" && "text-primary")} />
        Dashboard
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search for ideas, projects, or tasks..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-lg border-border/60 bg-muted/40 pl-10 text-sm placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* Light/Dark mode toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 cursor-pointer">
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        {/* New Idea button */}
        <Button
          onClick={onNewIdea}
          className="cursor-pointer gap-1.5 rounded-lg font-[family-name:var(--font-space-grotesk)] text-sm font-semibold transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          New Idea
        </Button>
      </div>
    </div>
  );
}

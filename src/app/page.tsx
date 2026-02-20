"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { BrainBoxScreen } from "@/components/screens/brain-box-screen";
import { LaunchPadScreen } from "@/components/screens/launch-pad-screen";
import { TrophyCaseScreen } from "@/components/screens/trophy-case-screen";
import { IdeaDialog } from "@/components/idea-dialog";
import { DeleteDialog } from "@/components/delete-dialog";
import { useIdeas } from "@/hooks/use-ideas";
import { Idea, Status } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Home() {
  const { ideas, addIdea, updateIdea, deleteIdea } = useIdeas();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);

  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPage, setSidebarPage] = useState("dashboard");

  const handleNewIdea = () => { setEditingIdea(null); setDialogOpen(true); };
  const handleEdit = (idea: Idea) => { setEditingIdea(idea); setDialogOpen(true); };
  const handleDelete = (idea: Idea) => { setDeleteTarget(idea); };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteIdea(deleteTarget.id);
      toast.success("Idea deleted", { description: `"${deleteTarget.title}" has been removed.` });
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = (ideaId: string, newStatus: Status) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;
    updateIdea(ideaId, { status: newStatus });
    const statusLabel = newStatus === "in-progress" ? "In Progress" : newStatus === "completed" ? "Completed" : "Draft";
    toast.success("Status updated", { description: `"${idea.title}" moved to ${statusLabel}.` });
  };

  const handleSave = (ideaData: Omit<Idea, "id" | "createdAt" | "updatedAt">) => {
    if (editingIdea) {
      updateIdea(editingIdea.id, ideaData);
      toast.success("Idea updated", { description: `"${ideaData.title}" has been saved.` });
    } else {
      addIdea(ideaData);
      toast.success("Idea created", { description: `"${ideaData.title}" added to Seedbed.` });
    }
  };

  const renderScreen = () => {
    switch (sidebarPage) {
      case "dashboard":
        return (
          <DashboardScreen
            ideas={ideas}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNewIdea={handleNewIdea}
            onNavigate={setSidebarPage}
            onStatusChange={handleStatusChange}
          />
        );
      case "brainbox":
        return (
          <BrainBoxScreen
            ideas={ideas}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNewIdea={handleNewIdea}
            onStatusChange={handleStatusChange}
          />
        );
      case "launchpad":
        return (
          <LaunchPadScreen
            ideas={ideas}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigate={setSidebarPage}
            onStatusChange={handleStatusChange}
          />
        );
      case "trophycase":
        return (
          <TrophyCaseScreen
            ideas={ideas}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onNavigate={setSidebarPage}
            onStatusChange={handleStatusChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        activeTab={sidebarPage}
        onTabChange={setSidebarPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-200",
          sidebarCollapsed ? "ml-[68px]" : "ml-[220px]"
        )}
      >
        <TopBar
          searchValue={search}
          onSearchChange={setSearch}
          onNewIdea={handleNewIdea}
          activeTab={sidebarPage}
          onTabChange={setSidebarPage}
        />

        <main className="flex-1 px-6 py-6">
          {renderScreen()}
        </main>
      </div>

      <IdeaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingIdea={editingIdea}
        onSave={handleSave}
      />
      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        ideaTitle={deleteTarget?.title ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

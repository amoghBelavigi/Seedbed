"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Idea } from "@/lib/types";

/**
 * Converts a Supabase row (snake_case) to our Idea type (camelCase).
 */
function rowToIdea(row: Record<string, unknown>): Idea {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? "",
    priority: row.priority as Idea["priority"],
    status: row.status as Idea["status"],
    githubRepo: (row.github_repo as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/**
 * Converts our Idea type (camelCase) to a Supabase row (snake_case).
 */
function ideaToRow(idea: Partial<Idea> & { id?: string }) {
  const row: Record<string, unknown> = {};
  if (idea.id !== undefined) row.id = idea.id;
  if (idea.title !== undefined) row.title = idea.title;
  if (idea.description !== undefined) row.description = idea.description;
  if (idea.priority !== undefined) row.priority = idea.priority;
  if (idea.status !== undefined) row.status = idea.status;
  if ("githubRepo" in idea) row.github_repo = idea.githubRepo ?? null;
  if (idea.updatedAt !== undefined) row.updated_at = idea.updatedAt;
  return row;
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all ideas from Supabase on mount
  const fetchIdeas = useCallback(async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error.message);
      // Fallback: try loading from localStorage cache
      try {
        const cached = window.localStorage.getItem("seedbed-ideas");
        if (cached) setIdeas(JSON.parse(cached));
      } catch {}
    } else if (data) {
      const mapped = data.map(rowToIdea);
      setIdeas(mapped);
      // Cache in localStorage for offline fallback
      try {
        window.localStorage.setItem("seedbed-ideas", JSON.stringify(mapped));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // CREATE
  const addIdea = async (idea: Omit<Idea, "id" | "createdAt" | "updatedAt">) => {
    const newId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newIdea: Idea = {
      ...idea,
      id: newId,
      createdAt: now,
      updatedAt: now,
    };

    // Optimistic update: show it immediately in the UI
    setIdeas((prev) => {
      const updated = [newIdea, ...prev];
      try { window.localStorage.setItem("seedbed-ideas", JSON.stringify(updated)); } catch {}
      return updated;
    });

    // Persist to Supabase
    const { error } = await supabase.from("ideas").insert({
      id: newId,
      title: idea.title,
      description: idea.description,
      priority: idea.priority,
      status: idea.status,
      github_repo: idea.githubRepo ?? null,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      // Roll back optimistic update
      setIdeas((prev) => prev.filter((i) => i.id !== newId));
    }

    return newIdea;
  };

  // UPDATE
  const updateIdea = async (id: string, updates: Partial<Omit<Idea, "id" | "createdAt">>) => {
    const now = new Date().toISOString();
    const fullUpdates = { ...updates, updatedAt: now };

    // Optimistic update
    setIdeas((prev) => {
      const updated = prev.map((idea) =>
        idea.id === id ? { ...idea, ...fullUpdates } : idea
      );
      try { window.localStorage.setItem("seedbed-ideas", JSON.stringify(updated)); } catch {}
      return updated;
    });

    // Persist to Supabase
    const row = ideaToRow({ ...updates, updatedAt: now });
    const { error } = await supabase.from("ideas").update(row).eq("id", id);

    if (error) {
      console.error("Supabase update error:", error.message);
      // Re-fetch to restore correct state
      fetchIdeas();
    }
  };

  // DELETE
  const deleteIdea = async (id: string) => {
    // Save for rollback
    const backup = ideas;

    // Optimistic update
    setIdeas((prev) => {
      const updated = prev.filter((idea) => idea.id !== id);
      try { window.localStorage.setItem("seedbed-ideas", JSON.stringify(updated)); } catch {}
      return updated;
    });

    // Persist to Supabase
    const { error } = await supabase.from("ideas").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error.message);
      setIdeas(backup);
    }
  };

  return {
    ideas,
    isLoading,
    addIdea,
    updateIdea,
    deleteIdea,
  };
}

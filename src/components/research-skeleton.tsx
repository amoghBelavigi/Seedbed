"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted dark:bg-zinc-700/50 ${className}`}
    />
  );
}

interface ResearchSkeletonProps {
  progressMessage?: string;
}

export function ResearchSkeleton({ progressMessage }: ResearchSkeletonProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Progress Message */}
      {progressMessage && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-medium text-primary">{progressMessage}</p>
          </div>
        </div>
      )}

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <Separator className="dark:bg-zinc-700" />

      {/* Similar Projects Skeleton */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Feasibility Analysis Skeleton */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-44" />
        </div>
        <Card className="p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
          <Separator className="my-4 dark:bg-zinc-700" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Differentiation Skeleton */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Card className="p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Separator className="dark:bg-zinc-700" />

      {/* Features Skeleton */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid gap-3">
          {[1, 2].map((i) => (
            <Card key={i} className="p-4 bg-card/50 dark:bg-zinc-800/50 border-border/50">
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

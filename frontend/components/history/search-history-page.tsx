"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, Eye, Plus, Search, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchHistoryStore } from "@/lib/stores/search-history-store";
import { getSearchUrl } from "@/lib/utils/search-params";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { formatPriceShort } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils";

export function SearchHistoryPage() {
  const router = useRouter();
  const sessions = useSearchHistoryStore((s) => s.sessions);
  const activeSessionId = useSearchHistoryStore((s) => s.activeSessionId);
  const setActiveSessionId = useSearchHistoryStore((s) => s.setActiveSessionId);
  const createSession = useSearchHistoryStore((s) => s.createSession);
  const deleteSession = useSearchHistoryStore((s) => s.deleteSession);
  const clearAll = useSearchHistoryStore((s) => s.clearAll);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const handleNewSession = () => {
    createSession();
    router.push("/dashboard/search");
  };

  const handleContinueSession = () => {
    if (!activeSession) {
      router.push("/dashboard/search");
      return;
    }
    const latestFilters = activeSession.entries[0]?.filters;
    router.push(latestFilters ? getSearchUrl(latestFilters) : "/dashboard/search");
  };

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold lg:text-4xl">Search History</h1>
            <p className="text-muted-foreground mt-2">
              Reopen previous searches or continue an existing search session.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAll} disabled={sessions.length === 0}>
              Clear history
            </Button>
            <Button onClick={handleNewSession}>
              <Plus className="h-4 w-4" />
              New session
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <FadeIn delay={0.2}>
          <Card className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-base">Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {sessions.length === 0 ? (
                <div className="text-muted-foreground flex min-h-48 flex-col items-center justify-center gap-3 text-center text-sm">
                  <Clock3 className="h-10 w-10" />
                  <p>No saved search sessions yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                        activeSessionId === session.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{session.title}</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {session.entries.length} search{session.entries.length !== 1 ? "es" : ""} | {session.viewedProperties.length} viewed | updated {formatRelativeTime(session.updatedAt)}
                          </p>
                        </div>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteSession(session.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.stopPropagation();
                              deleteSession(session.id);
                            }
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    {activeSession?.title ?? "Session details"}
                  </CardTitle>
                  {activeSession && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      Created {formatRelativeTime(activeSession.createdAt)}
                    </p>
                  )}
                </div>
                <Button onClick={handleContinueSession} disabled={!activeSession}>
                  <Search className="h-4 w-4" />
                  Continue session
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {!activeSession ? (
                <div className="text-muted-foreground flex min-h-48 items-center justify-center text-sm">
                  Select a session to view saved searches.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Search entries */}
                  {activeSession.entries.length === 0 && activeSession.viewedProperties.length === 0 ? (
                    <div className="text-muted-foreground flex min-h-48 items-center justify-center text-sm">
                      This session has no searches yet.
                    </div>
                  ) : (
                    <>
                      {activeSession.entries.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold">Searches</h3>
                          {activeSession.entries.map((entry, index) => (
                            <div key={entry.id} className="space-y-3">
                              <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{entry.title}</p>
                                    <Badge variant="secondary">{formatRelativeTime(entry.createdAt)}</Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(entry.filters).map(([key, value]) => (
                                      <Badge key={`${entry.id}-${key}`} variant="outline">
                                        {key}: {String(value)}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                  <Link href={getSearchUrl(entry.filters)}>Open search</Link>
                                </Button>
                              </div>
                              {index < activeSession.entries.length - 1 && <Separator />}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Viewed properties */}
                      {activeSession.viewedProperties.length > 0 && (
                        <div className="space-y-4">
                          {activeSession.entries.length > 0 && <Separator />}
                          <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <Eye className="h-4 w-4" />
                            Viewed Properties ({activeSession.viewedProperties.length})
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {activeSession.viewedProperties.map((vp) => (
                              <Link
                                key={vp.propertyId}
                                href={`/dashboard/search/${vp.propertyId}`}
                                className="hover:bg-muted/50 flex flex-col gap-1 rounded-lg border p-3 transition-colors"
                              >
                                <p className="truncate text-sm font-medium">{vp.title}</p>
                                {vp.areaName && (
                                  <p className="text-muted-foreground truncate text-xs">{vp.areaName}</p>
                                )}
                                <div className="flex items-center justify-between">
                                  {vp.price ? (
                                    <span className="text-primary text-sm font-semibold">
                                      {formatPriceShort(vp.price, "PKR")}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">Price N/A</span>
                                  )}
                                  <span className="text-muted-foreground text-xs">
                                    {formatRelativeTime(vp.viewedAt)}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

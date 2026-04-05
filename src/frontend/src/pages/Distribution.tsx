import { DistributionStatusPanel } from "@/components/DistributionStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Platform, Track } from "@/types/track";
import { PLATFORMS } from "@/types/track";
import { ChevronDown, ChevronUp, CreditCard, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DistributionProps {
  tracks: Track[];
  onSubmit: (trackId: string, platforms: Platform[]) => void;
}

const DISTRIBUTION_FEE = 1.99;

interface PendingDistribution {
  trackId: string;
  platforms: Platform[];
  trackTitle: string;
}

export function Distribution({ tracks, onSubmit }: DistributionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDistribution, setPendingDistribution] =
    useState<PendingDistribution | null>(null);

  const totalLive = tracks.reduce(
    (sum, t) =>
      sum + Object.values(t.distribution).filter((v) => v === "live").length,
    0,
  );
  const totalPossible = tracks.length * PLATFORMS.length;

  const handleDistributeClick = (track: Track, notSubmitted: Platform[]) => {
    setPendingDistribution({
      trackId: track.id,
      platforms: notSubmitted,
      trackTitle: track.title,
    });
  };

  const handleConfirmDistribute = () => {
    if (!pendingDistribution) return;
    onSubmit(pendingDistribution.trackId, pendingDistribution.platforms);
    setPendingDistribution(null);
    toast.success(
      "Distribution submitted! Processing your payment via Stripe.",
      { duration: 4000 },
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Distribution</h1>
        <p className="text-sm text-muted-foreground">
          {totalLive} / {totalPossible} platform slots active
        </p>
      </div>

      {/* Platform legend */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Supported Platforms
        </h2>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Fee notice */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <CreditCard className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Distribution fee:</span>{" "}
          $1.99 per platform, charged via Stripe at the time of distribution.
          Payments enable global streaming access.
        </p>
      </div>

      {/* Per-track distribution */}
      <div className="space-y-3">
        {tracks.map((track) => {
          const isExpanded = expandedId === track.id;
          const liveCount = Object.values(track.distribution).filter(
            (v) => v === "live",
          ).length;
          const notSubmitted = (PLATFORMS as Platform[]).filter(
            (p) => track.distribution[p] === "not_submitted",
          );
          const totalFee = (notSubmitted.length * DISTRIBUTION_FEE).toFixed(2);

          return (
            <div
              key={track.id}
              className="rounded-xl bg-card border border-border overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {track.artist} &middot; {liveCount}/{PLATFORMS.length} live
                  </p>
                </div>
                {notSubmitted.length > 0 && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary hidden sm:inline-flex"
                    >
                      ${totalFee} fee
                    </Badge>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs"
                      onClick={() => handleDistributeClick(track, notSubmitted)}
                      data-ocid="distribution.distribute.primary_button"
                    >
                      Distribute
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setExpandedId(isExpanded ? null : track.id)}
                  data-ocid="distribution.expand.toggle"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <DistributionStatusPanel
                    track={track}
                    onSubmit={(_trackId, platforms) =>
                      handleDistributeClick(track, platforms)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!pendingDistribution}
        onOpenChange={(open) => {
          if (!open) setPendingDistribution(null);
        }}
      >
        <DialogContent data-ocid="distribution.confirm.dialog">
          <DialogHeader>
            <DialogTitle>Confirm Distribution</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1">
                {pendingDistribution && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Distribute{" "}
                      <span className="text-foreground font-semibold">
                        &ldquo;{pendingDistribution.trackTitle}&rdquo;
                      </span>{" "}
                      to{" "}
                      <span className="text-foreground font-semibold">
                        {pendingDistribution.platforms.length} platform
                        {pendingDistribution.platforms.length !== 1 ? "s" : ""}
                      </span>
                      .
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pendingDistribution.platforms.map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className="text-xs border-primary/30 text-primary"
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Distribution fee
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          $
                          {(
                            pendingDistribution.platforms.length *
                            DISTRIBUTION_FEE
                          ).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${DISTRIBUTION_FEE.toFixed(2)} &times;{" "}
                        {pendingDistribution.platforms.length} platform
                        {pendingDistribution.platforms.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5 text-primary" />
                      Pay via Stripe. This enables your track to be streamed
                      globally.
                    </div>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPendingDistribution(null)}
              data-ocid="distribution.confirm.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDistribute}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white gap-2"
              data-ocid="distribution.confirm.confirm_button"
            >
              <CreditCard className="h-4 w-4" />
              Pay &amp; Distribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import {
  PLATFORMS,
  PLATFORM_REGISTER_URLS,
  PLATFORM_SEARCH_URLS,
} from "@/types/track";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Link2,
  Music,
  XCircle,
} from "lucide-react";
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

// Platform brand colors for visual identity
const PLATFORM_COLORS: Record<Platform, string> = {
  Spotify: "#1DB954",
  "YouTube Music": "#FF0000",
  "Apple Music": "#FC3C44",
  "Amazon Music": "#00A8E1",
  Gaana: "#E72429",
  JioSaavn: "#2BC5B4",
  "Wynk Music": "#0057A8",
  "Hungama Music": "#F15A24",
  Resso: "#FF2D55",
  Boomplay: "#F5A623",
  Deezer: "#00C7F2",
  Tidal: "#00FFFF",
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "live":
      return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-400" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    live: "border-green-400/50 text-green-400 bg-green-400/10",
    pending: "border-yellow-400/50 text-yellow-400 bg-yellow-400/10",
    rejected: "border-destructive/50 text-destructive bg-destructive/10",
    not_submitted: "border-border text-muted-foreground",
  };
  const labels: Record<string, string> = {
    live: "Live",
    pending: "Pending",
    rejected: "Rejected",
    not_submitted: "Not Submitted",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs px-2 py-0.5 ${classes[status] ?? classes.not_submitted}`}
    >
      {labels[status] ?? "Unknown"}
    </Badge>
  );
}

function buildSearchUrl(platform: Platform, track: Track): string {
  const query = encodeURIComponent(`${track.title} ${track.artist}`);
  return PLATFORM_SEARCH_URLS[platform] + query;
}

interface StreamingLinksDialogProps {
  track: Track | null;
  onClose: () => void;
}

function StreamingLinksDialog({ track, onClose }: StreamingLinksDialogProps) {
  const livePlatforms = track
    ? PLATFORMS.filter((p) => track.distribution[p] === "live")
    : [];
  const pendingPlatforms = track
    ? PLATFORMS.filter((p) => track.distribution[p] === "pending")
    : [];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} link copied!`);
    });
  };

  const copyAllLinks = () => {
    if (!track) return;
    const lines = livePlatforms
      .map((p) => `${p}: ${buildSearchUrl(p, track)}`)
      .join("\n");
    navigator.clipboard.writeText(lines).then(() => {
      toast.success("All streaming links copied to clipboard!");
    });
  };

  return (
    <Dialog open={!!track} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Streaming Links
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-1 pt-1">
              {track && (
                <p className="text-sm text-muted-foreground">
                  Share{" "}
                  <span className="text-foreground font-semibold">
                    &ldquo;{track.title}&rdquo;
                  </span>{" "}
                  by <span className="text-foreground">{track.artist}</span>{" "}
                  across all platforms.
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {livePlatforms.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Live on {livePlatforms.length} platform
                  {livePlatforms.length !== 1 ? "s" : ""}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1.5"
                  onClick={copyAllLinks}
                >
                  <Copy className="h-3 w-3" />
                  Copy All
                </Button>
              </div>
              {track &&
                livePlatforms.map((platform) => {
                  const searchUrl = buildSearchUrl(platform, track);
                  const color = PLATFORM_COLORS[platform];
                  return (
                    <div
                      key={platform}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium text-foreground flex-1 truncate">
                        {platform}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(searchUrl, platform)}
                          title="Copy link"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          asChild
                        >
                          <a
                            href={searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Open on ${platform}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {pendingPlatforms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Processing ({pendingPlatforms.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {pendingPlatforms.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 rounded-full text-xs border border-yellow-400/30 text-yellow-400 bg-yellow-400/5 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Links will be available once approved (typically 3-7 business
                days).
              </p>
            </div>
          )}

          {livePlatforms.length === 0 && pendingPlatforms.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              This track hasn&apos;t been distributed yet. Hit
              &ldquo;Distribute&rdquo; to publish it live.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Distribution({ tracks, onSubmit }: DistributionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDistribution, setPendingDistribution] =
    useState<PendingDistribution | null>(null);
  const [streamingLinksTrack, setStreamingLinksTrack] = useState<Track | null>(
    null,
  );
  const [showRegisterLinks, setShowRegisterLinks] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Distribution</h1>
          <p className="text-sm text-muted-foreground">
            {totalLive} / {totalPossible} platform slots active &mdash;{" "}
            {PLATFORMS.length} platforms supported
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => setShowRegisterLinks((v) => !v)}
          data-ocid="distribution.register_links.toggle"
        >
          <ExternalLink className="h-4 w-4" />
          {showRegisterLinks ? "Hide" : "Connect"} to Platforms
        </Button>
      </div>

      {/* Platform Registration / Connect Links */}
      {showRegisterLinks && (
        <div className="rounded-xl bg-card border border-border p-4 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Connect Your Account to Each Platform
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use these official links to register as an artist or submit music
              directly. Once distributed via SoundLaunch, your tracks will
              appear on these platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PLATFORMS.map((platform) => (
              <a
                key={platform}
                href={PLATFORM_REGISTER_URLS[platform]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all group"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                />
                <span className="text-sm font-medium text-foreground flex-1">
                  {platform}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Platform legend */}
      <div className="rounded-xl bg-card border border-border p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Supported Platforms
        </h2>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[p] }}
              />
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
          const hasLive = liveCount > 0;

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
                <div className="flex items-center gap-2 flex-shrink-0">
                  {hasLive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs border-green-400/30 text-green-400 hover:bg-green-400/10"
                      onClick={() => setStreamingLinksTrack(track)}
                      data-ocid="distribution.streaming_links.button"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Get Links</span>
                    </Button>
                  )}
                  {notSubmitted.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary hidden sm:inline-flex"
                      >
                        ${totalFee} fee
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs"
                        onClick={() =>
                          handleDistributeClick(track, notSubmitted)
                        }
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
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="space-y-2">
                    {PLATFORMS.map((platform) => {
                      const status = track.distribution[platform];
                      const isLive = status === "live";
                      const searchUrl = buildSearchUrl(platform, track);
                      return (
                        <div
                          key={platform}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <StatusIcon status={status} />
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: PLATFORM_COLORS[platform],
                              }}
                            />
                            <span className="text-sm font-medium text-foreground">
                              {platform}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={status} />
                            {isLive && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                asChild
                              >
                                <a
                                  href={searchUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Listen on ${platform}`}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            {status === "not_submitted" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                asChild
                              >
                                <a
                                  href={PLATFORM_REGISTER_URLS[platform]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`Connect to ${platform}`}
                                >
                                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Streaming Links Dialog */}
      <StreamingLinksDialog
        track={streamingLinksTrack}
        onClose={() => setStreamingLinksTrack(null)}
      />

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
                      Pay via Stripe. Your track will go live on all selected
                      platforms worldwide within 3&ndash;7 business days.
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

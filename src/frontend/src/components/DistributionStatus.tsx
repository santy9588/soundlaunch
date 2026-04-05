import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Platform, PlatformStatus, Track } from "@/types/track";
import { PLATFORMS } from "@/types/track";
import { CheckCircle2, Circle, Clock, Send, XCircle } from "lucide-react";

function StatusIcon({ status }: { status: PlatformStatus }) {
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

function StatusBadge({ status }: { status: PlatformStatus }) {
  const classes: Record<PlatformStatus, string> = {
    live: "border-green-400/50 text-green-400 bg-green-400/10",
    pending: "border-yellow-400/50 text-yellow-400 bg-yellow-400/10",
    rejected: "border-destructive/50 text-destructive bg-destructive/10",
    not_submitted: "border-border text-muted-foreground",
  };
  const labels: Record<PlatformStatus, string> = {
    live: "Live",
    pending: "Pending",
    rejected: "Rejected",
    not_submitted: "Not Submitted",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs px-2 py-0.5 ${classes[status]}`}
    >
      {labels[status]}
    </Badge>
  );
}

interface DistributionStatusPanelProps {
  track: Track;
  onSubmit?: (trackId: string, platforms: Platform[]) => void;
  compact?: boolean;
}

export function DistributionStatusPanel({
  track,
  onSubmit,
  compact = false,
}: DistributionStatusPanelProps) {
  const notSubmitted = PLATFORMS.filter(
    (p) => track.distribution[p] === "not_submitted",
  );

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <div key={p} className="flex items-center gap-1">
            <StatusIcon status={track.distribution[p]} />
            <span className="text-xs text-muted-foreground">{p}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {PLATFORMS.map((platform) => (
        <div
          key={platform}
          className="flex items-center justify-between py-2 border-b border-border last:border-0"
        >
          <div className="flex items-center gap-2">
            <StatusIcon status={track.distribution[platform]} />
            <span className="text-sm font-medium text-foreground">
              {platform}
            </span>
          </div>
          <StatusBadge status={track.distribution[platform]} />
        </div>
      ))}
      {onSubmit && notSubmitted.length > 0 && (
        <Button
          size="sm"
          className="w-full mt-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          onClick={() => onSubmit(track.id, notSubmitted)}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit to {notSubmitted.length} more platform
          {notSubmitted.length !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  );
}

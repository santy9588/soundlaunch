import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Track } from "@/types/track";
import {
  Download,
  MoreHorizontal,
  Music,
  Pencil,
  Play,
  Share2,
  Trash2,
} from "lucide-react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function handleDownload(track: Track) {
  if (track.audioUrl) {
    const a = document.createElement("a");
    a.href = track.audioUrl;
    a.download = `${track.title} - ${track.artist}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onEdit?: (track: Track) => void;
  onDelete?: (track: Track) => void;
  showStats?: boolean;
  selected?: boolean;
  onSelectToggle?: (id: string) => void;
  index?: number;
}

export function TrackCard({
  track,
  onPlay,
  onEdit,
  onDelete,
  showStats = false,
  selected = false,
  onSelectToggle,
  index,
}: TrackCardProps) {
  const liveCount = Object.values(track.distribution).filter(
    (v) => v === "live",
  ).length;

  const ocidSuffix = index !== undefined ? `.${index}` : "";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
        selected
          ? "bg-primary/10 ring-1 ring-primary/30"
          : "bg-card hover:bg-muted/30"
      }`}
    >
      {/* Checkbox */}
      {onSelectToggle && (
        <div className="flex-shrink-0 flex items-center">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelectToggle(track.id)}
            aria-label={`Select ${track.title}`}
            data-ocid={`releases.checkbox${ocidSuffix}`}
            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}

      {/* Cover */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
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

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist} · {track.album}
        </p>
      </div>

      {/* Duration */}
      <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
        {formatDuration(track.duration)}
      </span>

      {/* Stats */}
      {showStats && (
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs font-semibold text-foreground">
              {track.plays.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Plays</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-foreground">
              {track.downloads.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </div>
        </div>
      )}

      {/* Live badge */}
      <Badge
        variant="outline"
        className="text-xs px-2 py-0.5 border-primary/50 text-primary hidden sm:inline-flex flex-shrink-0"
      >
        {liveCount}/7 Live
      </Badge>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onPlay(track)}
          title="Play"
          data-ocid={`releases.item${ocidSuffix}`}
        >
          <Play className="h-4 w-4" />
        </Button>
        {track.audioUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleDownload(track)}
            title="Download"
            data-ocid={`releases.delete_button${ocidSuffix}`}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onPlay(track)}>
              <Play className="mr-2 h-4 w-4" /> Play
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload(track)}
              disabled={!track.audioUrl}
            >
              <Download className="mr-2 h-4 w-4" /> Download Audio
            </DropdownMenuItem>
            {onEdit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(track)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Metadata
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4" /> Distribute
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(track)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

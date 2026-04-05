import { TrackMetadataEditor } from "@/components/TrackMetadataEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Track } from "@/types/track";
import { FileText, Music, Pencil } from "lucide-react";
import { useState } from "react";

const LICENSE_TYPES = [
  "All Rights Reserved",
  "Creative Commons CC BY",
  "Creative Commons CC BY-SA",
  "Creative Commons CC BY-NC",
  "Creative Commons CC BY-ND",
  "Public Domain",
];

interface CopyrightProps {
  tracks: Track[];
  onUpdate: (id: string, updates: Partial<Track>) => void;
}

export function Copyright({ tracks, onUpdate }: CopyrightProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingTrack = tracks.find((t) => t.id === editingId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Copyright & Licensing
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage rights, licenses, and copyright info for your tracks
        </p>
      </div>

      {/* Tracks */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Your Tracks</h2>
        </div>
        <div className="divide-y divide-border">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-4 hover:bg-muted/20 transition-colors"
            >
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
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>

              <div className="hidden sm:block flex-shrink-0">
                <Select
                  value={track.license}
                  onValueChange={(v) => onUpdate(track.id, { license: v })}
                >
                  <SelectTrigger className="h-8 text-xs w-52 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LICENSE_TYPES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Badge
                variant="outline"
                className="hidden md:inline-flex text-xs border-primary/40 text-primary flex-shrink-0"
              >
                {track.rightsHolder || track.artist}
              </Badge>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="View Agreement"
                >
                  <FileText className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Edit Metadata"
                  onClick={() => setEditingId(track.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata editor */}
      {editingTrack && (
        <TrackMetadataEditor
          track={editingTrack}
          open={!!editingId}
          onClose={() => setEditingId(null)}
          onSave={(updates) => {
            onUpdate(editingId!, updates);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

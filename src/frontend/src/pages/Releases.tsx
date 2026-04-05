import { AudioUploader } from "@/components/AudioUploader";
import { TrackCard } from "@/components/TrackCard";
import { TrackMetadataEditor } from "@/components/TrackMetadataEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Track } from "@/types/track";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface ReleasesProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  onAdd: (trackData: Partial<Track>, file?: File, audioUrl?: string) => void;
}

export function Releases({
  tracks,
  onPlay,
  onEdit,
  onDelete,
  onAdd,
}: ReleasesProps) {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [pendingFile, setPendingFile] = useState<{
    file: File;
    audioUrl: string;
  } | null>(null);
  const [showMetaEditor, setShowMetaEditor] = useState(false);

  const genres = Array.from(new Set(tracks.map((t) => t.genre))).sort();

  const filtered = tracks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q);
    const matchGenre = genreFilter === "all" || t.genre === genreFilter;
    return matchSearch && matchGenre;
  });

  const handleFileSelected = (file: File, audioUrl: string) => {
    setPendingFile({ file, audioUrl });
    setShowUpload(false);
    setShowMetaEditor(true);
  };

  const handleSaveMeta = (updates: Partial<Track>) => {
    onAdd(updates, pendingFile?.file, pendingFile?.audioUrl);
    setPendingFile(null);
    setShowMetaEditor(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Releases</h1>
          <p className="text-sm text-muted-foreground">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          onClick={() => setShowUpload((v) => !v)}
        >
          <Plus className="mr-2 h-4 w-4" /> Upload Track
        </Button>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div className="rounded-xl bg-card border border-border p-4">
          <AudioUploader onFileSelected={handleFileSelected} />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-36 bg-input border-border">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Track list */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No tracks found. Upload your first track!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((track) => (
              <div key={track.id} className="px-2">
                <TrackCard
                  track={track}
                  onPlay={onPlay}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showStats
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metadata editor for new track */}
      {showMetaEditor && (
        <TrackMetadataEditor
          track={{
            title: pendingFile?.file.name.replace(/\.[^.]+$/, "") ?? "",
            audioUrl: pendingFile?.audioUrl,
          }}
          open={showMetaEditor}
          onClose={() => {
            setShowMetaEditor(false);
            setPendingFile(null);
          }}
          onSave={handleSaveMeta}
          isNew
        />
      )}
    </div>
  );
}

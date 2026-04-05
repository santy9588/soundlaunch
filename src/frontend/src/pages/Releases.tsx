import { AudioUploader } from "@/components/AudioUploader";
import { TrackCard, handleDownload } from "@/components/TrackCard";
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
import {
  CheckSquare,
  Download,
  Minus,
  Plus,
  Search,
  Square,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDownload = async () => {
    const selected = filtered.filter(
      (t) => selectedIds.has(t.id) && t.audioUrl,
    );
    if (selected.length === 0) {
      toast.error("No downloadable tracks selected.");
      return;
    }
    toast.success(
      `Downloading ${selected.length} track${selected.length !== 1 ? "s" : ""}...`,
    );
    for (let i = 0; i < selected.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          handleDownload(selected[i]);
          resolve();
        }, i * 120);
      });
    }
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((t) => selectedIds.has(t.id));
  const someFilteredSelected =
    filtered.some((t) => selectedIds.has(t.id)) && !allFilteredSelected;

  // Icon for the select-all button
  const SelectAllIcon = allFilteredSelected
    ? CheckSquare
    : someFilteredSelected
      ? Minus
      : Square;

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
          data-ocid="releases.upload.primary_button"
        >
          <Plus className="mr-2 h-4 w-4" /> Upload Track
        </Button>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl bg-card border border-border p-4 overflow-hidden"
        >
          <AudioUploader onFileSelected={handleFileSelected} />
        </motion.div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Select-all toggle */}
        <button
          type="button"
          className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
          onClick={handleSelectAll}
          aria-label={
            allFilteredSelected ? "Deselect all tracks" : "Select all tracks"
          }
          data-ocid="releases.select_all.toggle"
        >
          <SelectAllIcon
            className={`h-4 w-4 transition-colors ${
              allFilteredSelected || someFilteredSelected
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          />
          <span className="text-xs text-muted-foreground select-none">
            {allFilteredSelected ? "Deselect all" : "Select all"}
          </span>
        </button>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-input border-border"
            data-ocid="releases.search_input"
          />
        </div>
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger
            className="w-36 bg-input border-border"
            data-ocid="releases.genre.select"
          >
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

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            key="bulk-bar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30"
            data-ocid="releases.bulk.panel"
          >
            <span className="text-sm font-semibold text-primary">
              {selectedIds.size} track{selectedIds.size !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs gap-1"
                onClick={handleDeselectAll}
                data-ocid="releases.bulk.cancel_button"
              >
                <X className="h-3.5 w-3.5" />
                Deselect All
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5"
                onClick={handleBulkDownload}
                data-ocid="releases.bulk.primary_button"
              >
                <Download className="h-3.5 w-3.5" />
                Download Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track list */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground text-sm"
            data-ocid="releases.tracks.empty_state"
          >
            No tracks found. Upload your first track!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((track, i) => (
              <div
                key={track.id}
                className="px-2"
                data-ocid={`releases.item.${i + 1}`}
              >
                <TrackCard
                  track={track}
                  onPlay={onPlay}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showStats
                  selected={selectedIds.has(track.id)}
                  onSelectToggle={handleSelectToggle}
                  index={i + 1}
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

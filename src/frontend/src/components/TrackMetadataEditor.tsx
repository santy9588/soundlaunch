import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Track } from "@/types/track";
import { ImagePlus, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GENRES = [
  "Electronic",
  "Hip-Hop",
  "Pop",
  "Rock",
  "Ambient",
  "Jazz",
  "Classical",
  "Indie",
  "R&B",
  "Country",
  "Folk",
  "Metal",
  "Other",
];

const LICENSES = [
  "All Rights Reserved",
  "Creative Commons CC BY",
  "Creative Commons CC BY-SA",
  "Creative Commons CC BY-NC",
  "Creative Commons CC BY-ND",
  "Public Domain",
];

interface TrackMetadataEditorProps {
  track: Partial<Track> & { title?: string };
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Track>) => void;
  isNew?: boolean;
}

export function TrackMetadataEditor({
  track,
  open,
  onClose,
  onSave,
  isNew = false,
}: TrackMetadataEditorProps) {
  const [form, setForm] = useState({
    title: track.title ?? "",
    artist: track.artist ?? "",
    album: track.album ?? "",
    genre: track.genre ?? "Other",
    releaseDate: track.releaseDate ?? new Date().toISOString().split("T")[0],
    isrc: track.isrc ?? "",
    upc: track.upc ?? "",
    license: track.license ?? "All Rights Reserved",
    rightsHolder: track.rightsHolder ?? "",
    coverUrl: track.coverUrl ?? "",
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, coverUrl: url }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.artist.trim()) {
      toast.error("Title and artist are required");
      return;
    }
    onSave(form);
    toast.success(isNew ? "Track added!" : "Track updated!");
    onClose();
  };

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isNew ? "Add New Track" : "Edit Track Metadata"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Cover art */}
          <div className="sm:col-span-1 flex flex-col items-center gap-2">
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              {form.coverUrl ? (
                <img
                  src={form.coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full h-full min-h-[120px] bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                    <Music className="w-12 h-12 text-white/50" />
                  </div>
                </div>
              )}
            </div>
            <label className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <span>
                  <ImagePlus className="w-3 h-3 mr-1" /> Upload Cover
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </label>
          </div>

          {/* Form fields */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Track title"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Artist *</Label>
              <Input
                value={form.artist}
                onChange={(e) => set("artist", e.target.value)}
                placeholder="Artist name"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Album</Label>
              <Input
                value={form.album}
                onChange={(e) => set("album", e.target.value)}
                placeholder="Album name"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Genre</Label>
              <Select value={form.genre} onValueChange={(v) => set("genre", v)}>
                <SelectTrigger className="mt-1 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Release Date
              </Label>
              <Input
                type="date"
                value={form.releaseDate}
                onChange={(e) => set("releaseDate", e.target.value)}
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">ISRC</Label>
              <Input
                value={form.isrc}
                onChange={(e) => set("isrc", e.target.value)}
                placeholder="USRC17607839"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">UPC</Label>
              <Input
                value={form.upc}
                onChange={(e) => set("upc", e.target.value)}
                placeholder="012345678901"
                className="mt-1 bg-input border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">License</Label>
              <Select
                value={form.license}
                onValueChange={(v) => set("license", v)}
              >
                <SelectTrigger className="mt-1 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LICENSES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Rights Holder
              </Label>
              <Input
                value={form.rightsHolder}
                onChange={(e) => set("rightsHolder", e.target.value)}
                placeholder="Rights holder name"
                className="mt-1 bg-input border-border"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            {isNew ? "Add Track" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, FolderOpen, Music } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface AudioUploaderProps {
  onFileSelected: (file: File, audioUrl: string) => void;
}

const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/aac",
  "audio/flac",
  "audio/ogg",
  "audio/mp4",
];

const ACCEPTED_EXT = [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"];

export function AudioUploader({ onFileSelected }: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (
        !ACCEPTED_TYPES.includes(file.type) &&
        !ACCEPTED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext))
      ) {
        setError(
          "Unsupported format. Please upload MP3, WAV, AAC, FLAC, or OGG.",
        );
        return;
      }
      const audioUrl = URL.createObjectURL(file);
      onFileSelected(file, audioUrl);
    },
    [onFileSelected],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all",
          "flex flex-col items-center gap-4",
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-muted/20",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        aria-label="Drop audio file here or use the browse button below"
        data-ocid="uploader.dropzone"
      >
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary" : "bg-muted",
          )}
        >
          <Music
            className={cn(
              "w-7 h-7",
              isDragOver ? "text-primary-foreground" : "text-muted-foreground",
            )}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isDragOver ? "Drop your file here" : "Drag & Drop Audio File"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            MP3 · WAV · FLAC · AAC · OGG · M4A
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary font-semibold"
          onClick={() => inputRef.current?.click()}
          data-ocid="uploader.upload_button"
        >
          <FolderOpen className="h-4 w-4" />
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground">or drag and drop above</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT.join(",")}
          className="hidden"
          onChange={onInputChange}
          aria-label="Select audio file"
        />
      </div>
      {error && (
        <div
          className="mt-2 flex items-center gap-2 text-destructive text-sm"
          data-ocid="uploader.error_state"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  Music,
  Upload,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { StorageClient } from "../utils/StorageClient";

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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">(
    "idle",
  );
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const { actor } = useActor();

  const handleFile = useCallback(
    async (file: File) => {
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

      setUploadFileName(file.name);
      setUploadState("uploading");
      setUploadProgress(0);

      try {
        const config = await loadConfig();
        const storageGatewayUrl = config.storage_gateway_url;

        // If no valid gateway configured, fall back to object URL
        if (!storageGatewayUrl || storageGatewayUrl === "nogateway") {
          const audioUrl = URL.createObjectURL(file);
          setUploadState("done");
          setUploadProgress(100);
          setTimeout(() => {
            setUploadState("idle");
            setUploadProgress(null);
          }, 1500);
          onFileSelected(file, audioUrl);
          return;
        }

        // Build a storage client using the current agent (or anonymous agent)
        let agentToUse: HttpAgent;
        if (actor) {
          // Try to get the agent from the config using an anonymous-compatible approach
          agentToUse = new HttpAgent({ host: config.backend_host });
        } else {
          agentToUse = new HttpAgent({ host: config.backend_host });
        }

        if (config.backend_host?.includes("localhost")) {
          await agentToUse.fetchRootKey().catch(() => {});
        }

        const storageClient = new StorageClient(
          config.bucket_name,
          storageGatewayUrl,
          config.backend_canister_id,
          config.project_id,
          agentToUse,
        );

        const fileBytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(fileBytes, (pct) => {
          setUploadProgress(pct);
        });

        const blobUrl = await storageClient.getDirectURL(hash);

        setUploadState("done");
        setUploadProgress(100);
        setTimeout(() => {
          setUploadState("idle");
          setUploadProgress(null);
        }, 1500);

        onFileSelected(file, blobUrl);
      } catch (err) {
        console.error("Blob upload failed, falling back to object URL:", err);
        // Graceful fallback: use object URL
        const audioUrl = URL.createObjectURL(file);
        setUploadState("done");
        setUploadProgress(100);
        setError(
          "Cloud upload unavailable — using local preview. Re-upload after signing in for persistent storage.",
        );
        setTimeout(() => {
          setUploadState("idle");
          setUploadProgress(null);
        }, 2000);
        onFileSelected(file, audioUrl);
      }
    },
    [onFileSelected, actor],
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

  const isUploading = uploadState === "uploading";
  const isDone = uploadState === "done";

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all",
          "flex flex-col items-center gap-4",
          isDragOver
            ? "border-primary bg-primary/10"
            : isUploading
              ? "border-primary/70 bg-primary/5"
              : isDone
                ? "border-emerald-500/60 bg-emerald-500/5"
                : "border-border hover:border-primary/50 hover:bg-muted/20",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={!isUploading ? onDrop : undefined}
        aria-label="Drop audio file here or use the browse button below"
        data-ocid="uploader.dropzone"
      >
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
            isDragOver
              ? "bg-primary"
              : isUploading
                ? "bg-primary/20"
                : isDone
                  ? "bg-emerald-500/20"
                  : "bg-muted",
          )}
        >
          {isUploading ? (
            <Upload className="w-7 h-7 text-primary animate-bounce" />
          ) : isDone ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          ) : (
            <Music
              className={cn(
                "w-7 h-7",
                isDragOver
                  ? "text-primary-foreground"
                  : "text-muted-foreground",
              )}
            />
          )}
        </div>

        {isUploading ? (
          <div className="w-full space-y-2" data-ocid="uploader.loading_state">
            <p className="text-sm font-semibold text-foreground">
              Uploading to cloud storage...
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-xs mx-auto">
              {uploadFileName}
            </p>
            <div className="w-full max-w-xs mx-auto">
              <Progress value={uploadProgress ?? 0} className="h-2" />
            </div>
            <p className="text-xs text-primary font-medium">
              {uploadProgress ?? 0}%
            </p>
          </div>
        ) : isDone ? (
          <div data-ocid="uploader.success_state">
            <p className="text-sm font-semibold text-emerald-400">
              Upload complete!
            </p>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
              {uploadFileName}
            </p>
          </div>
        ) : (
          <>
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
            <p className="text-xs text-muted-foreground">
              or drag and drop above
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT.join(",")}
          className="hidden"
          onChange={onInputChange}
          disabled={isUploading}
          aria-label="Select audio file"
        />
      </div>
      {error && (
        <div
          className="mt-2 flex items-center gap-2 text-amber-400 text-sm"
          data-ocid="uploader.error_state"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

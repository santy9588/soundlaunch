import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { Track } from "@/types/track";
import {
  Download,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Generate stable waveform heights for a track
function generateWaveform(seed: string, count = 60): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return Array.from({ length: count }, (_) => {
    hash = (hash * 1664525 + 1013904223) & 0xffffffff;
    const base = Math.abs(hash) % 70;
    return 20 + base;
  });
}

interface AudioPlayerProps {
  track: Track;
  onClose: () => void;
}

export function AudioPlayer({ track, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const waveHeights = generateWaveform(track.id, 60);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(track.duration);
  }, [track.duration]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      setIsPlaying((prev) => !prev);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying((prev) => !prev);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Simulate playback progress when no real audio
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const skip = (seconds: number) => {
    setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const handleDownload = () => {
    if (track.audioUrl) {
      const a = document.createElement("a");
      a.href = track.audioUrl;
      a.download = `${track.title} - ${track.artist}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const progressPercent = duration > 0 ? currentTime / duration : 0;
  const playedBars = Math.floor(progressPercent * waveHeights.length);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[oklch(0.12_0.018_265/0.95)] backdrop-blur-xl border-t border-border">
      {track.audioUrl && (
        // biome-ignore lint/a11y/useMediaCaption: Music player - captions not applicable
        <audio
          ref={audioRef}
          src={track.audioUrl}
          onTimeUpdate={() =>
            setCurrentTime(audioRef.current?.currentTime ?? 0)
          }
          onDurationChange={() =>
            setDuration(audioRef.current?.duration ?? track.duration)
          }
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Cover */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="flex-shrink-0 w-36 hidden sm:block">
          <p className="text-sm font-semibold text-foreground truncate">
            {track.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {track.artist}
          </p>
        </div>

        {/* Waveform + scrubber */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Waveform */}
          <div
            className="hidden sm:flex items-end gap-[2px] h-10"
            aria-hidden="true"
          >
            {waveHeights.map((h, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static waveform bars
                key={`bar-${i}`}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: `${h}%`,
                  backgroundColor:
                    i < playedBars
                      ? "oklch(0.6 0.22 292)"
                      : "oklch(0.3 0.01 265)",
                  ...(isPlaying && i === playedBars
                    ? { animation: "waveform-pulse 0.6s ease-in-out infinite" }
                    : {}),
                }}
              />
            ))}
          </div>
          {/* Time scrubber */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="flex-1"
              onValueChange={([v]) => setCurrentTime(v)}
            />
            <span className="text-xs text-muted-foreground w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => skip(-10)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={togglePlay}
            size="icon"
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground glow-purple"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => skip(10)}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 w-28">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMuted((m) => !m)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={([v]) => {
              setVolume(v / 100);
              setIsMuted(false);
            }}
          />
        </div>

        {/* Download */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={handleDownload}
          title={track.audioUrl ? "Download audio" : "No audio file available"}
          disabled={!track.audioUrl}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

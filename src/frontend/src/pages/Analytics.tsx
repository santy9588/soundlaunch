import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Track } from "@/types/track";
import { Download, Music } from "lucide-react";

interface AnalyticsProps {
  tracks: Track[];
}

function generateTrendData(base: number): number[] {
  return Array.from({ length: 10 }, (_, i) => {
    const noise = (Math.random() - 0.4) * base * 0.2;
    return Math.max(0, Math.round(base * (0.6 + (i / 9) * 0.4) + noise));
  });
}

function handleDownload(track: Track) {
  if (track.audioUrl) {
    const a = document.createElement("a");
    a.href = track.audioUrl;
    a.download = `${track.title} - ${track.artist}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export function Analytics({ tracks }: AnalyticsProps) {
  const totalPlays = tracks.reduce((s, t) => s + t.plays, 0);
  const totalDownloads = tracks.reduce((s, t) => s + t.downloads, 0);
  const totalEarnings = tracks.reduce((s, t) => s + t.earnings, 0);
  const totalTracks = tracks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Performance overview across all your releases
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Plays"
          value={totalPlays.toLocaleString()}
          trend="up"
          trendLabel="+12%"
          data={generateTrendData(totalPlays / 10)}
        />
        <StatCard
          label="Downloads"
          value={totalDownloads.toLocaleString()}
          trend="up"
          trendLabel="+8%"
          data={generateTrendData(totalDownloads / 10)}
        />
        <StatCard
          label="Earnings"
          value={totalEarnings.toFixed(2)}
          trend="up"
          trendLabel="+15%"
          data={generateTrendData(totalEarnings / 10)}
          prefix="$"
        />
        <StatCard
          label="Tracks"
          value={String(totalTracks)}
          trend="flat"
          trendLabel="Steady"
          data={[
            totalTracks,
            totalTracks,
            totalTracks + 1,
            totalTracks + 1,
            totalTracks,
          ]}
        />
      </div>

      {/* Per-track table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Track Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Track
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                  Plays
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                  Downloads
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                  Earnings
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">
                  Genre
                </th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium" />
              </tr>
            </thead>
            <tbody>
              {tracks
                .slice()
                .sort((a, b) => b.plays - a.plays)
                .map((track) => (
                  <tr
                    key={track.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          {track.coverUrl ? (
                            <img
                              src={track.coverUrl}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
                              <Music className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      {track.plays.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-foreground">
                      {track.downloads.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      ${track.earnings.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/40 text-primary"
                      >
                        {track.genre}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleDownload(track)}
                        disabled={!track.audioUrl}
                        title={
                          track.audioUrl
                            ? "Download audio"
                            : "No file available"
                        }
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

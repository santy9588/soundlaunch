import { AudioUploader } from "@/components/AudioUploader";
import { StatCard } from "@/components/StatCard";
import { TrackCard } from "@/components/TrackCard";
import { Button } from "@/components/ui/button";
import type { Page, Track } from "@/types/track";
import { DollarSign, Music, Send, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

interface DashboardProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onEdit: (track: Track) => void;
  onNavigate: (page: Page) => void;
  onUpload: (file: File, audioUrl: string) => void;
}

const QUICK_ACTIONS = [
  {
    icon: Music,
    label: "My Tracks",
    description: "Manage your uploaded tracks",
    page: "releases" as Page,
    gradient: "from-violet-600/20 to-purple-700/10",
    iconBg: "bg-violet-600/20",
    iconColor: "text-violet-400",
    hoverBorder: "hover:border-violet-500/50",
  },
  {
    icon: Send,
    label: "Distribute",
    description: "Stream on 7 platforms",
    page: "distribution" as Page,
    gradient: "from-blue-600/20 to-cyan-700/10",
    iconBg: "bg-blue-600/20",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
  },
  {
    icon: DollarSign,
    label: "Earn",
    description: "View your revenue",
    page: "earn" as Page,
    gradient: "from-emerald-600/20 to-green-700/10",
    iconBg: "bg-emerald-600/20",
    iconColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
  },
];

export function Dashboard({
  tracks,
  onPlay,
  onEdit,
  onNavigate,
  onUpload,
}: DashboardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPlays = tracks.reduce((s, t) => s + t.plays, 0);
  const totalDownloads = tracks.reduce((s, t) => s + t.downloads, 0);
  const totalEarnings = tracks.reduce((s, t) => s + t.earnings, 0);

  const playsData = [
    3200, 3800, 4100, 3700, 4500, 5200, 4900, 6100, 5800, 6500,
  ];
  const dlData = [180, 210, 240, 220, 280, 310, 290, 340, 320, 380];
  const earningsData = [65, 78, 82, 74, 91, 108, 101, 124, 118, 133];

  const recentTracks = tracks.slice(0, 3);

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      onUpload(file, audioUrl);
    }
    e.target.value = "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero upload section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-background border border-violet-700/30 p-8 sm:p-12 flex flex-col items-center text-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center glow-purple">
          <Upload className="w-7 h-7 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
            Upload Your Audio
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
            Choose a file from your computer to get started &mdash; then
            distribute to 7 platforms worldwide.
          </p>
        </div>
        <Button
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 gap-2 shadow-lg shadow-violet-900/30"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="dashboard.upload_button"
        >
          <Upload className="h-5 w-5" />
          Choose Audio File
        </Button>
        <p className="text-xs text-muted-foreground">
          or drag &amp; drop below &middot; MP3, WAV, FLAC, AAC, OGG, M4A
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.flac,.aac,.ogg,.m4a"
          className="hidden"
          onChange={handleHeroFileChange}
          aria-label="Select audio file from your system"
        />
      </motion.div>

      {/* Quick action cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.page}
              type="button"
              onClick={() => onNavigate(action.page)}
              className={`rounded-xl bg-gradient-to-br ${action.gradient} border border-border ${action.hoverBorder} p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group`}
              data-ocid={`dashboard.${action.label.toLowerCase().replace(/ /g, "_")}.button`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.iconBg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
              {action.page === "releases" && tracks.length > 0 && (
                <span className="mt-2 inline-block text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {tracks.length} tracks
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          label="Total Plays"
          value={totalPlays.toLocaleString()}
          trend="up"
          trendLabel="+12% this month"
          data={playsData}
        />
        <StatCard
          label="Total Downloads"
          value={totalDownloads.toLocaleString()}
          trend="up"
          trendLabel="+8% this month"
          data={dlData}
        />
        <StatCard
          label="Est. Earnings"
          value={totalEarnings.toFixed(2)}
          trend="up"
          trendLabel="Steady growth"
          data={earningsData}
          prefix="$"
        />
      </motion.div>

      {/* Recent tracks */}
      {recentTracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl bg-card border border-border p-4"
          data-ocid="dashboard.recent.list"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Tracks
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => onNavigate("releases")}
              data-ocid="dashboard.releases.link"
            >
              View all
            </Button>
          </div>
          <div className="space-y-1">
            {recentTracks.map((track, i) => (
              <div key={track.id} data-ocid={`dashboard.recent.item.${i + 1}`}>
                <TrackCard
                  track={track}
                  onPlay={onPlay}
                  onEdit={onEdit}
                  showStats
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Drag and drop upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-xl bg-card border border-border p-4"
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Drag &amp; Drop Upload
        </h2>
        <AudioUploader onFileSelected={onUpload} />
      </motion.div>
    </div>
  );
}

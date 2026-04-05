import { AudioPlayer } from "@/components/AudioPlayer";
import { TrackMetadataEditor } from "@/components/TrackMetadataEditor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { useTracks } from "@/hooks/useTracks";
import { Analytics } from "@/pages/Analytics";
import { Copyright } from "@/pages/Copyright";
import { Dashboard } from "@/pages/Dashboard";
import { Distribution } from "@/pages/Distribution";
import { Earn } from "@/pages/Earn";
import { Releases } from "@/pages/Releases";
import type { Page, Platform, Track } from "@/types/track";
import { useCallback, useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const { tracks, addTrack, updateTrack, deleteTrack, submitForDistribution } =
    useTracks();

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePlay = useCallback((track: Track) => {
    setNowPlaying(track);
  }, []);
  const handleEdit = useCallback((track: Track) => {
    setEditingTrack(track);
  }, []);
  const handleDeleteTrack = useCallback(
    (track: Track) => {
      deleteTrack(track.id);
    },
    [deleteTrack],
  );

  const handleAdd = useCallback(
    (trackData: Partial<Track>, _file?: File, audioUrl?: string) => {
      addTrack({
        title: trackData.title ?? "Untitled",
        artist: trackData.artist ?? "Unknown Artist",
        album: trackData.album ?? "",
        genre: trackData.genre ?? "Other",
        releaseDate:
          trackData.releaseDate ?? new Date().toISOString().split("T")[0],
        isrc: trackData.isrc ?? "",
        upc: trackData.upc ?? "",
        duration: 180,
        license: trackData.license ?? "All Rights Reserved",
        rightsHolder: trackData.rightsHolder ?? trackData.artist ?? "",
        coverUrl: trackData.coverUrl,
        audioUrl: audioUrl,
      });
    },
    [addTrack],
  );

  const handleUpload = useCallback(
    (file: File, audioUrl: string) => {
      addTrack({
        title: file.name.replace(/\.[^.]+$/, ""),
        artist: "Unknown Artist",
        album: "",
        genre: "Other",
        releaseDate: new Date().toISOString().split("T")[0],
        isrc: "",
        upc: "",
        duration: 180,
        license: "All Rights Reserved",
        rightsHolder: "",
        audioUrl,
      });
      navigate("releases");
    },
    [addTrack, navigate],
  );

  const handleDistribute = useCallback(
    (trackId: string, platforms: Platform[]) => {
      submitForDistribution(trackId, platforms);
    },
    [submitForDistribution],
  );

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            tracks={tracks}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onNavigate={navigate}
            onUpload={handleUpload}
          />
        );
      case "releases":
        return (
          <Releases
            tracks={tracks}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDeleteTrack}
            onAdd={handleAdd}
          />
        );
      case "analytics":
        return <Analytics tracks={tracks} />;
      case "distribution":
        return <Distribution tracks={tracks} onSubmit={handleDistribute} />;
      case "copyright":
        return <Copyright tracks={tracks} onUpdate={updateTrack} />;
      case "earn":
        return <Earn tracks={tracks} />;
      default:
        return (
          <Dashboard
            tracks={tracks}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onNavigate={navigate}
            onUpload={handleUpload}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main
        className="flex-1"
        style={{ paddingBottom: nowPlaying ? "88px" : 0 }}
      >
        {renderPage()}
      </main>
      <Footer />

      {nowPlaying && (
        <AudioPlayer track={nowPlaying} onClose={() => setNowPlaying(null)} />
      )}

      {editingTrack && (
        <TrackMetadataEditor
          track={editingTrack}
          open={!!editingTrack}
          onClose={() => setEditingTrack(null)}
          onSave={(updates) => {
            updateTrack(editingTrack.id, updates);
            setEditingTrack(null);
          }}
        />
      )}

      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground",
            success: "border-primary/50",
            error: "border-destructive/50",
          },
        }}
      />
    </div>
  );
}

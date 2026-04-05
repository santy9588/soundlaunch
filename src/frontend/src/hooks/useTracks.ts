import type { DistributionStatus, Platform, Track } from "@/types/track";
import { PLATFORMS } from "@/types/track";
import { useCallback, useState } from "react";

function randomStatus(): import("@/types/track").PlatformStatus {
  const statuses: import("@/types/track").PlatformStatus[] = [
    "live",
    "pending",
    "not_submitted",
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function makeDistribution(): DistributionStatus {
  const d: Partial<DistributionStatus> = {};
  for (const p of PLATFORMS) {
    d[p] = randomStatus();
  }
  return d as DistributionStatus;
}

const SEED_TRACKS: Track[] = [
  {
    id: "t1",
    title: "Neon Waves",
    artist: "DJ Aurora",
    album: "Synthwave Vol. 1",
    genre: "Electronic",
    releaseDate: "2024-03-15",
    isrc: "USRC17607839",
    upc: "012345678901",
    duration: 192,
    plays: 4821,
    downloads: 312,
    earnings: 24.1,
    distribution: {
      Spotify: "live",
      "YouTube Music": "live",
      "Apple Music": "pending",
      "Amazon Music": "live",
      Gaana: "live",
      JioSaavn: "pending",
      "Wynk Music": "live",
      "Hungama Music": "not_submitted",
      Resso: "live",
      Boomplay: "pending",
      Deezer: "live",
      Tidal: "not_submitted",
    },
    license: "All Rights Reserved",
    rightsHolder: "DJ Aurora",
    uploadedAt: "2024-03-10",
  },
  {
    id: "t2",
    title: "Midnight Rain",
    artist: "Lunar Echo",
    album: "Night Sessions",
    genre: "Ambient",
    releaseDate: "2024-02-01",
    isrc: "USRC17607840",
    upc: "012345678902",
    duration: 215,
    plays: 2341,
    downloads: 189,
    earnings: 11.7,
    distribution: {
      Spotify: "live",
      "YouTube Music": "live",
      "Apple Music": "live",
      "Amazon Music": "pending",
      Gaana: "not_submitted",
      JioSaavn: "live",
      "Wynk Music": "pending",
      "Hungama Music": "live",
      Resso: "not_submitted",
      Boomplay: "live",
      Deezer: "pending",
      Tidal: "live",
    },
    license: "Creative Commons CC BY",
    rightsHolder: "Lunar Echo",
    uploadedAt: "2024-01-28",
  },
  {
    id: "t3",
    title: "Fire Starter",
    artist: "Blaze MC",
    album: "Street Heat",
    genre: "Hip-Hop",
    releaseDate: "2024-01-10",
    isrc: "USRC17607841",
    upc: "012345678903",
    duration: 178,
    plays: 9032,
    downloads: 721,
    earnings: 45.16,
    distribution: {
      Spotify: "live",
      "YouTube Music": "live",
      "Apple Music": "live",
      "Amazon Music": "live",
      Gaana: "live",
      JioSaavn: "live",
      "Wynk Music": "live",
      "Hungama Music": "live",
      Resso: "pending",
      Boomplay: "live",
      Deezer: "live",
      Tidal: "live",
    },
    license: "All Rights Reserved",
    rightsHolder: "Blaze MC",
    uploadedAt: "2024-01-05",
  },
  {
    id: "t4",
    title: "Ocean Drive",
    artist: "The Coastals",
    album: "Summer Vibes",
    genre: "Pop",
    releaseDate: "2023-12-20",
    isrc: "USRC17607842",
    upc: "012345678904",
    duration: 203,
    plays: 6571,
    downloads: 445,
    earnings: 32.85,
    distribution: {
      Spotify: "live",
      "YouTube Music": "pending",
      "Apple Music": "live",
      "Amazon Music": "live",
      Gaana: "live",
      JioSaavn: "pending",
      "Wynk Music": "live",
      "Hungama Music": "not_submitted",
      Resso: "live",
      Boomplay: "not_submitted",
      Deezer: "live",
      Tidal: "pending",
    },
    license: "All Rights Reserved",
    rightsHolder: "The Coastals",
    uploadedAt: "2023-12-15",
  },
  {
    id: "t5",
    title: "Crystal Clear",
    artist: "Prism",
    album: "Refraction",
    genre: "Indie",
    releaseDate: "2023-11-05",
    isrc: "USRC17607843",
    upc: "012345678905",
    duration: 241,
    plays: 1832,
    downloads: 97,
    earnings: 9.16,
    distribution: {
      Spotify: "pending",
      "YouTube Music": "not_submitted",
      "Apple Music": "not_submitted",
      "Amazon Music": "not_submitted",
      Gaana: "not_submitted",
      JioSaavn: "not_submitted",
      "Wynk Music": "pending",
      "Hungama Music": "not_submitted",
      Resso: "not_submitted",
      Boomplay: "not_submitted",
      Deezer: "not_submitted",
      Tidal: "not_submitted",
    },
    license: "Creative Commons CC BY-NC",
    rightsHolder: "Prism",
    uploadedAt: "2023-11-01",
  },
];

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>(SEED_TRACKS);

  const addTrack = useCallback(
    (
      track: Omit<
        Track,
        | "id"
        | "plays"
        | "downloads"
        | "earnings"
        | "distribution"
        | "uploadedAt"
      >,
    ) => {
      const newTrack: Track = {
        ...track,
        id: `t${Date.now()}`,
        plays: 0,
        downloads: 0,
        earnings: 0,
        distribution: makeDistribution(),
        uploadedAt: new Date().toISOString().split("T")[0],
      };
      setTracks((prev) => [newTrack, ...prev]);
      return newTrack;
    },
    [],
  );

  const updateTrack = useCallback((id: string, updates: Partial<Track>) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  }, []);

  const deleteTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const submitForDistribution = useCallback(
    (trackId: string, platforms: Platform[]) => {
      setTracks((prev) =>
        prev.map((t) => {
          if (t.id !== trackId) return t;
          const updated = { ...t.distribution };
          for (const p of platforms) {
            updated[p] = "pending";
          }
          return { ...t, distribution: updated };
        }),
      );
    },
    [],
  );

  return { tracks, addTrack, updateTrack, deleteTrack, submitForDistribution };
}

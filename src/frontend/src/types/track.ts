export type PlatformStatus = "live" | "pending" | "not_submitted" | "rejected";

export type Platform =
  | "Spotify"
  | "Gaana"
  | "JioSaavn"
  | "Wynk Music"
  | "Hungama Music"
  | "Resso"
  | "Boomplay";

export const PLATFORMS: Platform[] = [
  "Spotify",
  "Gaana",
  "JioSaavn",
  "Wynk Music",
  "Hungama Music",
  "Resso",
  "Boomplay",
];

export interface DistributionStatus {
  Spotify: PlatformStatus;
  Gaana: PlatformStatus;
  JioSaavn: PlatformStatus;
  "Wynk Music": PlatformStatus;
  "Hungama Music": PlatformStatus;
  Resso: PlatformStatus;
  Boomplay: PlatformStatus;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  isrc: string;
  upc: string;
  duration: number;
  plays: number;
  downloads: number;
  earnings: number;
  distribution: DistributionStatus;
  license: string;
  rightsHolder: string;
  coverUrl?: string;
  audioUrl?: string;
  uploadedAt: string;
}

export type Page =
  | "dashboard"
  | "releases"
  | "analytics"
  | "distribution"
  | "copyright"
  | "earn";

export type PlatformStatus = "live" | "pending" | "not_submitted" | "rejected";

export type Platform =
  | "Spotify"
  | "YouTube Music"
  | "Apple Music"
  | "Amazon Music"
  | "Gaana"
  | "JioSaavn"
  | "Wynk Music"
  | "Hungama Music"
  | "Resso"
  | "Boomplay"
  | "Deezer"
  | "Tidal";

export const PLATFORMS: Platform[] = [
  "Spotify",
  "YouTube Music",
  "Apple Music",
  "Amazon Music",
  "Gaana",
  "JioSaavn",
  "Wynk Music",
  "Hungama Music",
  "Resso",
  "Boomplay",
  "Deezer",
  "Tidal",
];

// Official aggregator/distributor registration links for each platform
export const PLATFORM_REGISTER_URLS: Record<Platform, string> = {
  Spotify:
    "https://artists.spotify.com/en/help/article/distributing-music-to-spotify",
  "YouTube Music": "https://support.google.com/youtubemusic/answer/9709827",
  "Apple Music":
    "https://artists.apple.com/support/1647-getting-music-on-apple-music",
  "Amazon Music": "https://music.amazon.com/artists",
  Gaana: "https://gaana.com/upload",
  JioSaavn: "https://www.jiosaavn.com/artists/submit",
  "Wynk Music": "https://wynk.in/music",
  "Hungama Music": "https://www.hungama.com/music",
  Resso: "https://open.resso.com",
  Boomplay: "https://www.boomplaymusic.com/artists",
  Deezer: "https://deezer.com/en/company/music-distribution",
  Tidal: "https://support.tidal.com/hc/en-us/articles/360024032354",
};

// Base search URLs to find tracks on each platform
export const PLATFORM_SEARCH_URLS: Record<Platform, string> = {
  Spotify: "https://open.spotify.com/search/",
  "YouTube Music": "https://music.youtube.com/search?q=",
  "Apple Music": "https://music.apple.com/search?term=",
  "Amazon Music": "https://music.amazon.com/search/",
  Gaana: "https://gaana.com/search/",
  JioSaavn: "https://www.jiosaavn.com/search/",
  "Wynk Music": "https://wynk.in/music/search/",
  "Hungama Music": "https://www.hungama.com/search/",
  Resso: "https://open.resso.com/",
  Boomplay: "https://www.boomplaymusic.com/search/",
  Deezer: "https://www.deezer.com/search/",
  Tidal: "https://tidal.com/search?q=",
};

export interface DistributionStatus {
  Spotify: PlatformStatus;
  "YouTube Music": PlatformStatus;
  "Apple Music": PlatformStatus;
  "Amazon Music": PlatformStatus;
  Gaana: PlatformStatus;
  JioSaavn: PlatformStatus;
  "Wynk Music": PlatformStatus;
  "Hungama Music": PlatformStatus;
  Resso: PlatformStatus;
  Boomplay: PlatformStatus;
  Deezer: PlatformStatus;
  Tidal: PlatformStatus;
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

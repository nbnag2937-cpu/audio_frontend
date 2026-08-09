export type AudioStatus = "ready" | "processing" | "failed";

export interface AudioPart {
  id: string;
  partNumber: number;
  title: string;
  durationSec: number;
  audioUrl: string;
}

export interface AudioItem {
  id: string;
  title: string;
  description: string;
  adLinkUrl: string;
  status: AudioStatus;
  totalListened: number;
  totalListening: number;
  currentListeners: number;
  createdAt: string;
  parts: AudioPart[];
}

export interface AudioWithOwner extends AudioItem {
  owner: { id: string; name: string; email: string };
}

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

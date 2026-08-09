import { listAudiosAction } from "@/actions/user.actions";
import { AudioItem } from "@/types/audio";

const MAX_PAGE_SIZE = 100;

let cachedAllAudio: AudioItem[] | null = null;
let inFlightRequest: Promise<AudioItem[]> | null = null;

async function fetchAllAudioFromApi(): Promise<AudioItem[]> {
  const items: AudioItem[] = [];
  let page = 1;
  let total = Infinity;

  while (items.length < total) {
    const res = await listAudiosAction({
      page,
      pageSize: MAX_PAGE_SIZE,
      sort: "newest",
    });

    items.push(...res.items);
    total = res.total;

    if (res.items.length === 0) break;

    page++;
  }

  return items;
}

export async function getAllAudio(): Promise<AudioItem[]> {
  if (cachedAllAudio) {
    return cachedAllAudio;
  }

  if (!inFlightRequest) {
    inFlightRequest = fetchAllAudioFromApi()
      .then((items) => {
        cachedAllAudio = items;
        return items;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export function invalidateAllAudioCache(): void {
  cachedAllAudio = null;
  inFlightRequest = null;
}

export async function getNewReleaseAudio(count = 4): Promise<AudioItem[]> {
  const all = await getAllAudio();
  return all.slice(0, count);
}

export async function getAudioById(id: string): Promise<AudioItem | undefined> {
  const all = await getAllAudio();
  return all.find((audio) => audio.id === id);
}

export async function getAdjacentAudioId(
  currentId: string,
  direction: "next" | "prev",
): Promise<string | undefined> {
  const all = await getAllAudio();
  const currentIndex = all.findIndex((audio) => audio.id === currentId);
  if (currentIndex === -1) return undefined;

  const offset = direction === "next" ? 1 : -1;
  const targetIndex = (currentIndex + offset + all.length) % all.length;

  return all[targetIndex]?.id;
}

export async function getRandomRecommendedAudio(
  excludeId: string,
  count: number,
): Promise<AudioItem[]> {
  const all = await getAllAudio();
  const pool = all.filter((audio) => audio.id !== excludeId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function fetchAudioById(
  id: string,
): Promise<AudioItem | undefined> {
  return getAudioById(id);
}

export async function fetchRecommendedAudio(
  excludeId: string,
  count = 8,
): Promise<AudioItem[]> {
  return getRandomRecommendedAudio(excludeId, count);
}

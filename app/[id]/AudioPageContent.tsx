"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Headphones, Moon, Pause, Play } from "lucide-react";
import { AudioItem, AudioPart, PlaybackRate } from "@/types/audio";
import {
  fetchAudioById,
  fetchRecommendedAudio,
  getAdjacentAudioId,
} from "@/services/audio.service";
import {
  playAudioAction,
  checkUnlockStatusAction,
  unlockTodayAction,
} from "@/actions/user.actions"; // TODO: khớp lại đúng path trong dự án
import { ApiRequestError } from "@/lib/api-client";
import {
  formatDuration,
  formatListenCount,
  formatVietnameseDate,
} from "@/lib/format";
import { consumeAutoplayNext, markAutoplayNext } from "@/lib/autoplay";
import EpisodeList from "@/components/audio/EpisodeList";
import RecommendedList from "@/components/audio/RecommendedList";
import PlayerBar from "@/components/audio/PlayerBar";
import SleepTimerMenu from "@/components/audio/SleepTimerMenu";
import AdGateModal from "@/components/audio/AdGateModal";

interface AudioPageContentProps {
  audioId: string;
}

// Cac "part" chi la chia lat thoi luong cua CUNG 1 file audio tren R2 (khong phai file rieng).
// Ham nay tinh moc thoi gian TUYET DOI (trong file that) ma 1 part bat dau, bang tong
// durationSec cua tat ca cac part dung truoc no.
function getPartStartOffset(parts: AudioPart[], partIndex: number): number {
  let offset = 0;
  for (let i = 0; i < partIndex; i += 1) {
    offset += parts[i]?.durationSec ?? 0;
  }
  return offset;
}

function AudioPageContent({ audioId }: AudioPageContentProps) {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);
  const stopAtPartEndRef = useRef(false);
  const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Theo doi part nao vua duoc "seek" toi, de chi tua lai audio khi THAT SU doi part
  // (khong tua moi lan bam Phat/Tam dung, vi do se lam mat vi tri dang nghe do dang)
  const lastSeekedPartIndexRef = useRef<number | null>(null);

  const [audio, setAudio] = useState<AudioItem | null>(null);
  const [recommended, setRecommended] = useState<AudioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activePartIndex, setActivePartIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [sleepLabel, setSleepLabel] = useState<string | null>(null);
  const [isTopSleepMenuOpen, setIsTopSleepMenuOpen] = useState(false);

  // ---- Cac ham lien quan phat audio: PHAI khai bao truoc useEffect ben duoi
  // vi useEffect goi consumeAutoplayNext() -> requestPlaybackFor ngay trong effect dau tien.
  // Dat const arrow function sau diem su dung se bi TDZ ("Cannot access before declaration").

  // Goi API /stream de lay audioUrl that roi merge vao audio state.
  // Nhan audioSnapshot lam tham so de dung duoc ca luc goi tu useEffect (truoc khi
  // state `audio` cap nhat xong) lan luc goi tu cac handler o duoi.
  const requestPlaybackFor = async (audioSnapshot: AudioItem) => {
    setStreamError(null);

    const currentPart = audioSnapshot.parts[activePartIndex];
    // Da co audioUrl cho part nay roi (da goi /stream truoc do) -> phat luon, khoi goi lai API
    if (currentPart?.audioUrl) {
      setIsPlaying(true);
      setHasStartedPlayback(true);
      return;
    }

    setIsStreamLoading(true);
    try {
      const streamedAudio = await playAudioAction(audioId);
      setAudio(streamedAudio);
      setIsPlaying(true);
      setHasStartedPlayback(true);
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.code === "UNLOCK_REQUIRED"
      ) {
        setIsAdModalOpen(true);
      } else {
        setStreamError("Không phát được audio, vui lòng thử lại.");
      }
    } finally {
      setIsStreamLoading(false);
    }
  };

  // Kiem tra unlock qua API that (co cache localStorage ben trong checkUnlockStatusAction)
  // thay vi doc rieng 1 flag localStorage khac khong dong bo voi backend.
  const requestPlayback = async () => {
    if (!audio) return;

    const unlocked = await checkUnlockStatusAction();
    if (!unlocked) {
      setIsAdModalOpen(true);
      return;
    }
    void requestPlaybackFor(audio);
  };

  // Chỉ fetch dữ liệu. Không setState reset thủ công — component được
  // remount qua key={audioId} nên state đã sạch sẵn.
  useEffect(() => {
    let isCancelled = false;

    fetchAudioById(audioId).then((result) => {
      if (isCancelled) return;
      setAudio(result ?? null);
      setIsLoading(false);
      if (result && consumeAutoplayNext()) {
        // Autoplay khi chuyển bài kế tiếp: vẫn phải đi qua requestPlaybackFor
        // để lấy audioUrl thật, không set isPlaying trực tiếp ở đây nữa.
        void requestPlaybackFor(result);
      }
    });

    fetchRecommendedAudio(audioId, 8).then((result) => {
      if (!isCancelled) setRecommended(result);
    });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioId]);

  // Dieu khien play/pause VA tua (seek) toi diem bat dau cua part khi thuc su doi part.
  // Vi cac part dung chung 1 file audio, doi activePartIndex KHONG lam audioUrl thay doi
  // (src the <audio> khong doi) nen phai tu tay set currentTime, khong the trong cho
  // trinh duyet tu load lai nguon nhu file khac nhau.
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !audio) return;

    const activePart = audio.parts[activePartIndex];
    if (!activePart?.audioUrl) return;

    const offset = getPartStartOffset(audio.parts, activePartIndex);
    const partChanged = lastSeekedPartIndexRef.current !== activePartIndex;

    const applyPlayback = () => {
      if (partChanged) {
        audioEl.currentTime = offset;
        lastSeekedPartIndexRef.current = activePartIndex;
      }
      if (isPlaying) {
        audioEl.play().catch(() => setIsPlaying(false));
      } else {
        audioEl.pause();
      }
    };

    // readyState >= 1 (HAVE_METADATA) nghia la audio.duration/currentTime da dung de set
    if (audioEl.readyState >= 1) {
      applyPlayback();
      return;
    }
    audioEl.addEventListener("loadedmetadata", applyPlayback, { once: true });
    return () => audioEl.removeEventListener("loadedmetadata", applyPlayback);
  }, [activePartIndex, isPlaying, audio]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    return () => {
      if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF3F7] text-[black]/60">
        Đang tải audio...
      </div>
    );
  }

  if (!audio) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#FFF3F7] text-[black]">
        <p>Không tìm thấy audio.</p>
        <Link
          href="/"
          className="cursor-pointer text-[#D6336C] hover:underline"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const parts = audio.parts;
  const activePart = parts[activePartIndex];
  const totalDurationSec = parts.reduce(
    (sum, part) => sum + part.durationSec,
    0,
  );

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    void requestPlayback();
  };

  const handlePlayPart = (index: number) => {
    setActivePartIndex(index);
    setCurrentTime(0);
    // audioUrl cua cac part deu giong nhau (chia lat cung 1 fileKey theo mapper BE),
    // nen neu audio hien tai da co audioUrl thi khong can goi lai API — effect ben tren
    // se tu tua toi offset dung cua part moi.
    void requestPlayback();
  };

  // Xu ly khi nguoi nghe het 1 "part": vi cac part chung 1 file, khong the dua vao
  // su kien 'onEnded' cua the <audio> (chi no khi het TOAN BO file), phai tu tinh
  // dua vao moc thoi gian tuong doi trong handleTimeUpdate ben duoi.
  const handlePartEnded = () => {
    if (stopAtPartEndRef.current) {
      stopAtPartEndRef.current = false;
      setIsPlaying(false);
      setSleepLabel(null);
      return;
    }
    if (activePartIndex < parts.length - 1) {
      setActivePartIndex((index) => index + 1);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
    }
  };

  // e.currentTarget.currentTime la thoi gian TUYET DOI trong file audio dung chung.
  // Phai tru di offset cua part hien tai de ra thoi gian TUONG DOI (0..durationSec cua part)
  // dung cho progress bar, dong thoi phat hien khi da het 1 part de tu chuyen part tiep theo.
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const absoluteTime = event.currentTarget.currentTime;
    const offset = getPartStartOffset(parts, activePartIndex);
    const relativeTime = Math.max(0, absoluteTime - offset);

    if (activePart && relativeTime >= activePart.durationSec) {
      handlePartEnded();
      return;
    }
    setCurrentTime(relativeTime);
  };

  // Bam "Mo khoa & nghe" trong modal -> phai goi API that (unlockTodayAction) de backend
  // ghi UnlockLog cho deviceId hom nay, KHONG chi luu flag localStorage phia client
  // (neu chi luu local, /stream se van tra UNLOCK_REQUIRED vi backend chua biet gi ca).
  const handleUnlockAd = async () => {
    setIsUnlocking(true);
    setStreamError(null);
    try {
      await unlockTodayAction();
      setIsAdModalOpen(false);
      await requestPlaybackFor(audio);
    } catch (error) {
      setStreamError("Không xác nhận được mở khóa, vui lòng thử lại.");
    } finally {
      setIsUnlocking(false);
    }
  };

  // time truyen vao la thoi gian TUONG DOI trong part hien tai -> phai cong offset
  // cua part de ra thoi gian tuyet doi that su tua toi trong file.
  const handleSeek = (time: number) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    const offset = getPartStartOffset(parts, activePartIndex);
    audioEl.currentTime = offset + time;
    setCurrentTime(time);
  };

  const handleSkipPrev = () => {
    const audioEl = audioRef.current;
    const offset = getPartStartOffset(parts, activePartIndex);
    if (audioEl) audioEl.currentTime = offset;
    setCurrentTime(0);
  };

  const handleSkipNextAudio = () => {
    const nextId = getAdjacentAudioId(audioId, "next");
    if (!nextId) return;
    markAutoplayNext();
    router.push(`/${nextId}`);
  };

  const clearSleepTimer = () => {
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
      sleepTimeoutRef.current = null;
    }
    stopAtPartEndRef.current = false;
  };

  const handleSelectSleepMinutes = (minutes: number) => {
    clearSleepTimer();
    setSleepLabel(`${minutes} phút`);
    sleepTimeoutRef.current = setTimeout(
      () => {
        setIsPlaying(false);
        setSleepLabel(null);
      },
      minutes * 60 * 1000,
    );
  };

  const handleSelectSleepEndOfTrack = () => {
    clearSleepTimer();
    stopAtPartEndRef.current = true;
    setSleepLabel("Hết bài này");
  };

  const statusLabel = `Tập ${activePartIndex + 1}/${parts.length} • ${
    isStreamLoading ? "Đang tải..." : isPlaying ? "Đang phát" : "Tạm dừng"
  }`;

  return (
    <div className="min-h-screen bg-[#FFF3F7] pb-28">
      <audio
        ref={audioRef}
        src={activePart.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handlePartEnded}
      />

      {isAdModalOpen && (
        <AdGateModal
          shopeeUrl={audio.adLinkUrl}
          onUnlock={handleUnlockAd}
          onClose={() => setIsAdModalOpen(false)}
        />
      )}

      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 md:px-8 lg:px-20 xl:px-70">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 cursor-pointer text-sm text-[black]/70 hover:text-[black]"
        >
          ← Quay lại
        </button>

        <div className="rounded-2xl border border-[#F1D6E0] bg-white/70 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#D6336C]/12">
              <div className="flex h-full items-center justify-center text-[#D6336C]">
                <Headphones size={32} />
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-[#FFF3F7]/80 px-1.5 py-0.5 text-xs text-[black]">
                {formatDuration(totalDurationSec)}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <h1 className="text-2xl font-bold text-[black] sm:text-3xl">
                {audio.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-md border border-[#F1D6E0] px-2 py-0.5 font-mono text-xs text-[black]/80">
                  Audio Full
                </span>
                <span className="rounded-full bg-[#D6336C]/12 px-2 py-0.5 text-xs text-[#D6336C]">
                  {audio.status === "ready" ? "sẵn sàng" : "đang xử lý"}
                </span>
                <span className="flex items-center gap-1 text-[black]/60">
                  <Headphones size={14} />
                  {formatListenCount(audio.totalListened)} lượt nghe
                </span>
              </div>

              <span className="text-sm text-[black]/50">
                {formatVietnameseDate(audio.createdAt)}
              </span>

              {streamError && (
                <span className="text-sm text-red-500">{streamError}</span>
              )}

              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  disabled={isStreamLoading}
                  className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#D6336C] px-5 py-2.5 font-semibold text-white hover:bg-[#AD1457] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  {isStreamLoading
                    ? "Đang tải..."
                    : isPlaying
                      ? "Tạm dừng"
                      : "Phát"}
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTopSleepMenuOpen((open) => !open)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#F1D6E0] px-4 py-2.5 text-[black] hover:bg-[#D6336C]/10"
                  >
                    <Moon size={18} />
                    {sleepLabel ?? "Hẹn giờ"}
                  </button>
                  {isTopSleepMenuOpen && (
                    <SleepTimerMenu
                      onSelectMinutes={(minutes) => {
                        handleSelectSleepMinutes(minutes);
                        setIsTopSleepMenuOpen(false);
                      }}
                      onSelectEndOfTrack={() => {
                        handleSelectSleepEndOfTrack();
                        setIsTopSleepMenuOpen(false);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <EpisodeList
          parts={parts}
          activePartIndex={activePartIndex}
          onPlayPart={handlePlayPart}
        />

        <RecommendedList items={recommended} />
      </div>

      {hasStartedPlayback && (
        <PlayerBar
          title={audio.title}
          statusLabel={statusLabel}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={activePart.durationSec}
          playbackRate={playbackRate}
          sleepLabel={sleepLabel}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onSkipPrev={handleSkipPrev}
          onSkipNext={handleSkipNextAudio}
          onChangeRate={setPlaybackRate}
          onSelectSleepMinutes={handleSelectSleepMinutes}
          onSelectSleepEndOfTrack={handleSelectSleepEndOfTrack}
        />
      )}
    </div>
  );
}

export default AudioPageContent;

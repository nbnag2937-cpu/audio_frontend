"use client";

import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getRankedAudiosAction } from "@/actions/user.actions"; // sua lai dung duong dan action cua ban
import type {
  RankingMetric,
  RankingPeriod,
  RankedAudioItem,
} from "@/services/user.service";

interface AudioSectionWithSortProps {
  title: string;
  metric: RankingMetric;
  limit?: number;
}

const PERIOD_OPTIONS: { label: string; value: RankingPeriod }[] = [
  { label: "Hôm nay", value: "today" },
  { label: "Tháng", value: "month" },
  { label: "Năm", value: "year" },
];

function AudioSectionWithSort({
  title,
  metric,
  limit = 10,
}: AudioSectionWithSortProps) {
  const router = useRouter();
  const [period, setPeriod] = useState<RankingPeriod>("today");
  const audioContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!audioContainerRef.current) return;
    audioContainerRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Gop lai thanh 1 hang duy nhat: title + sort + nut scroll, giong style ban dau */}
      <div className="ts-header flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-xl w-full">{title}</h2>
          <div className="ts-sort flex gap-1">
            {PERIOD_OPTIONS.map((option) => (
              <Button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`rounded-full border-[#F1D6E0] cursor-pointer ${
                  period === option.value
                    ? "bg-[#7A1140] hover:bg-[#7A1140]"
                    : "bg-transparent text-[#7A1140] hover:bg-[#FFEAF1]"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="ts-scroll-btn flex items-center gap-2">
          <Button
            onClick={() => scroll("left")}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110 w-10 h-10 cursor-pointer"
          >
            <ChevronLeft className="text-black" />
          </Button>
          <Button
            onClick={() => scroll("right")}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110 w-10 h-10 cursor-pointer"
          >
            <ChevronRight className="text-black" />
          </Button>
        </div>
      </div>

      <RankedAudioList
        key={`${metric}-${period}-${limit}`}
        metric={metric}
        period={period}
        limit={limit}
        containerRef={audioContainerRef}
        onItemClick={(id) => router.push(id)}
      />
    </div>
  );
}

interface RankedAudioListProps {
  metric: RankingMetric;
  period: RankingPeriod;
  limit: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onItemClick: (id: string) => void;
}

function RankedAudioList({
  metric,
  period,
  limit,
  containerRef,
  onItemClick,
}: RankedAudioListProps) {
  const [audios, setAudios] = useState<RankedAudioItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRankedAudiosAction({ metric, period, limit })
      .then((data) => {
        if (!cancelled) setAudios(data);
      })
      .catch(() => {
        if (!cancelled) setAudios([]);
      });
    return () => {
      cancelled = true;
    };
  }, [metric, period, limit]);

  const loading = audios === null;

  if (loading) {
    return <p className="text-sm text-zinc-500">Đang tải...</p>;
  }

  if (audios.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Chưa có dữ liệu trong khoảng thời gian này.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-scroll gap-5 w-full scrollbar-hide"
    >
      {audios.map((audio) => (
        <div
          onClick={() => onItemClick(audio.id)}
          key={audio.id}
          className="bg-white rounded-xl shrink-0 w-60 p-3 border hover:border-[#D6336C] transition duration-400 border-[#F1D6E0] flex flex-col gap-2 cursor-pointer"
        >
          <h3 className="font-bold text-md truncate">{audio.title}</h3>
          <div className="border px-1 w-fit text-[10px] font-semibold">
            Audio Full
          </div>
          <div className="flex items-center gap-1">
            <Headphones size={15} />
            <span className="text-xs">
              {audio.totalListening >= 1000
                ? `${(audio.totalListening / 1000).toFixed(1)}N`
                : audio.totalListening}{" "}
              lượt nghe
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#D6336C]">
            <span>●</span>
            <span className="text-xs">
              {audio.currentListeners >= 1000
                ? `${(audio.currentListeners / 1000).toFixed(1)}N`
                : audio.currentListeners}{" "}
              đang nghe
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AudioSectionWithSort;

import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { AudioItem } from "@/types/audio";

interface AudioSectionWithSortOptions {
  title: string;
  audio: AudioItem[];
}

function AudioSectionWithSort(
  AudioSectionWithSort: AudioSectionWithSortOptions,
) {
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (!audioContainerRef.current) return;

    audioContainerRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="ts-header flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-xl w-full">
            {AudioSectionWithSort.title}
          </h2>
          <div className="ts-sort flex gap-1">
            <Button className="rounded-full bg-[#7A1140] hover:bg-[#7A1140] border-[#F1D6E0] cursor-pointer">
              Hôm nay
            </Button>
            <Button className="rounded-full bg-[#7A1140] hover:bg-[#7A1140] border-[#F1D6E0] cursor-pointer">
              Tháng
            </Button>
            <Button className="rounded-full bg-[#7A1140] hover:bg-[#7A1140] border-[#F1D6E0] cursor-pointer">
              Năm
            </Button>
          </div>
        </div>
        <div className="ts-scroll-btn flex items-center gap-2">
          <Button
            onClick={() => {
              scroll("left");
            }}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110  w-10 h-10 cursor-pointer"
          >
            <ChevronLeft className="text-black" />
          </Button>
          <Button
            onClick={() => {
              scroll("right");
            }}
            className="rounded-full bg-[#FFEAF1] hover:bg-white hover:border-[#F1D6E0] duration-300 transition hover:scale-110 w-10 h-10 cursor-pointer"
          >
            <ChevronRight className="text-black" />
          </Button>
        </div>
      </div>
      <div
        ref={audioContainerRef}
        className="flex overflow-x-scroll gap-5 w-full scrollbar-hide"
      >
        {AudioSectionWithSort.audio.map((audio) => (
          <div
            onClick={() => router.push(audio.id)}
            key={audio.id}
            className="bg-white rounded-xl shrink-0 w-60 p-3 border hover:border-[#D6336C] transition duration-400 border-[#F1D6E0] flex flex-col gap-2 cursor-pointer"
          >
            <h3 className="font-bold text-xl">{audio.title}</h3>
            <div className="border px-1 w-fit text-[10px] font-semibold">
              Audio Full
            </div>
            <div className="flex items-center gap-1">
              <Headphones size={15} />
              <span className="text-xs">
                {audio.totalListened >= 1000
                  ? `${(audio.totalListened / 1000).toFixed(1)}N`
                  : audio.totalListened}{" "}
                lượt nghe
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#D6336C]">
              <span>●</span>
              <span className="text-xs">
                {audio.totalListening >= 1000
                  ? `${(audio.totalListening / 1000).toFixed(1)}N`
                  : audio.totalListening}{" "}
                đang nghe
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AudioSectionWithSort;

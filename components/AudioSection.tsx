import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { AudioItem } from "@/types/audio";

interface AudioSectionOptions {
  title: string;
  audio: AudioItem[];
}

function AudioSection(AudioSection: AudioSectionOptions) {
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
      <div className="ts-header flex items-center justify-between mb-2">
        <h2 className="font-semibold text-xl w-full">{AudioSection.title}</h2>
        <div className="ts-scroll-btn flex items-center gap-2">
          <Button
            onClick={() => {
              scroll("left");
            }}
            className="rounded-full bg-[#071A16] hover:bg-[#12302A] hover:border-[#24453D] duration-300 transition hover:scale-110  w-10 h-10 cursor-pointer"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => {
              scroll("right");
            }}
            className="rounded-full bg-[#071A16] hover:bg-[#12302A] hover:border-[#24453D] duration-300 transition hover:scale-110 w-10 h-10 cursor-pointer"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div
        ref={audioContainerRef}
        className="flex overflow-x-scroll gap-5 w-full scrollbar-hide"
      >
        {AudioSection.audio.map((audio) => (
          <div
            onClick={() => router.push(audio.id)}
            key={audio.id}
            className="bg-[#12302A] rounded-xl shrink-0 w-60 p-3 border border-[#24453D] hover:border-[#458475] transition duration-400 flex flex-col gap-2 cursor-pointer"
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
            <div className="flex items-center gap-1 text-[#befbd0]">
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

export default AudioSection;

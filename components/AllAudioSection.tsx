"use client";

import { ArrowLeft, ArrowRight, ChevronRight, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { listAudiosAction } from "@/actions/user.actions";
import { AudioItem } from "@/types/audio";

const PAGE_SIZE = 10;

function AllAudioSection() {
  const router = useRouter();

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [totalAudio, setTotalAudio] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const totalPage = Math.max(1, Math.ceil(totalAudio / PAGE_SIZE));

  const loadPage = useCallback(async (page: number) => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await listAudiosAction({
        page,
        pageSize: PAGE_SIZE,
        sort: "newest",
      });
      setAudios(res.items);
      setTotalAudio(res.total);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPage(currentPage);
  }, [currentPage, loadPage]);

  const getPaginationPages = (currentPage: number, totalPage: number) => {
    if (totalPage <= 7) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPage];
    }

    if (currentPage >= totalPage - 3) {
      return [
        1,
        "...",
        totalPage - 4,
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPage,
    ];
  };

  const pages = getPaginationPages(currentPage, totalPage);

  const handlePrevPage = () => {
    if (currentPage <= 1) {
      return;
    }

    setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage >= totalPage) {
      return;
    }

    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="ts-header flex items-center justify-between mb-3">
        <h2 className="font-semibold text-xl w-full">Tất cả audio</h2>
      </div>

      {loadError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <p className="text-sm text-black/60">
            Đã có lỗi xảy ra khi tải danh sách audio.
          </p>
          <button
            type="button"
            onClick={() => loadPage(currentPage)}
            className="rounded-lg bg-[#D6336C] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Thử lại
          </button>
        </div>
      ) : loading ? (
        <p className="py-10 text-center text-sm text-black/60">Đang tải...</p>
      ) : (
        <>
          {/* CONTAINER */}
          <div className="flex flex-col overflow-x-scroll gap-5 w-full scrollbar-hide">
            {audios.map((audio) => (
              <div
                onClick={() => router.push(audio.id)}
                key={audio.id}
                className="bg-white rounded-xl shrink-0 w-full p-3 hover:border-[#D6336C] transition duration-400 border items-center gap-5 border-[#F1D6E0] flex cursor-pointer"
              >
                <Button className="rounded-full bg-[#2B0A18] hover:bg-[#7A1140] hover:border-[#F1D6E0] duration-300 transition hover:scale-110  w-10 h-10 cursor-pointer">
                  <ChevronRight />
                </Button>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-xl truncate">
                      {audio.title}
                    </h3>
                    <div className="border px-1 w-fit text-[10px] font-semibold">
                      Audio Full
                    </div>
                  </div>
                  <div className="text-sm text-black/60">
                    {audio.description}
                  </div>
                  <div className="flex items-center gap-3">
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
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mx-auto flex items-center justify-center gap-2 mt-8 mb-10">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-10 px-3 cursor-pointer rounded-lg bg-white border border-[#F1D6E0]
      text-black/70 hover:bg-[#7A1140] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trước</span>
            </Button>

            <div className="flex items-center gap-1">
              {pages.map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="w-10 h-10 flex items-center justify-center text-[#C98BA8]"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(+page)}
                    className={`
            w-10 h-10 rounded-lg cursor-pointer border transition duration-200
            ${
              currentPage === page
                ? "bg-[#D6336C] border-[#D6336C] text-white"
                : "bg-white border-[#F1D6E0] text-black/70 hover:bg-[#7A1140] hover:text-white"
            }
          `}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPage}
              className="h-10 px-3 rounded-lg cursor-pointer bg-white border border-[#F1D6E0]
      text-black/70 hover:bg-[#7A1140] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Sau</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default AllAudioSection;

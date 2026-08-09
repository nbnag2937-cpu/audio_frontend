"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Headphones, Search, X } from "lucide-react";
import AllAudioSection from "@/components/AllAudioSection";
import AudioSection from "@/components/AudioSection";
import AudioSectionWithSort from "@/components/AudioSectionWithSort";
import { Input } from "@/components/ui/input";
import { formatListenCount } from "@/lib/format";
import {
  getTopListenedThisMonthAction,
  getTrendingTodayAction,
  listAudiosAction,
} from "@/actions/user.actions";
import { AudioItem } from "@/types/audio";

const MAX_SEARCH_RESULTS = 8;
const SEARCH_DEBOUNCE_MS = 300;
const HOME_PAGE_SIZE = 20;
const SECTION_LIMIT = 4;

function HomePageClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Du lieu trang chu - lay tu API that thay vi mock
  const [allAudios, setAllAudios] = useState<AudioItem[]>([]);
  const [trending, setTrending] = useState<AudioItem[]>([]);
  const [topListened, setTopListened] = useState<AudioItem[]>([]);
  const [totalAudio, setTotalAudio] = useState(0);
  // loading mac dinh la true vi lan render dau tien chac chan can cho fetch mount
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Ket qua tim kiem: goi API rieng theo tu khoa, khong loc mang local nua
  const [searchResults, setSearchResults] = useState<AudioItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadHomeData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [audiosRes, trendingRes, topListenedRes] = await Promise.all([
        listAudiosAction({ page: 1, pageSize: HOME_PAGE_SIZE, sort: "newest" }),
        getTrendingTodayAction(SECTION_LIMIT),
        getTopListenedThisMonthAction(SECTION_LIMIT),
      ]);
      setAllAudios(audiosRes.items);
      setTotalAudio(audiosRes.total);
      setTrending(trendingRes);
      setTopListened(topListenedRes);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHomeData();
  }, [loadHomeData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }

    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchLoading(true);

    listAudiosAction({
      search: debouncedQuery,
      page: 1,
      pageSize: MAX_SEARCH_RESULTS,
    })
      .then((res) => {
        if (!cancelled) setSearchResults(res.items);
      })
      .catch(() => {
        if (!cancelled) setSearchResults([]);
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const hasQuery = query.trim().length > 0;
  const isDebouncePending = hasQuery && query.trim() !== debouncedQuery;
  const showDropdown = isSearchOpen && hasQuery;
  const newReleaseAudio = useMemo(
    () => allAudios.slice(0, SECTION_LIMIT),
    [allAudios],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSearchOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleClearSearch = () => {
    setQuery("");
    setIsSearchOpen(false);
  };

  const handleSelectResult = () => {
    setIsSearchOpen(false);
  };

  if (loadError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-[#FFF3F7] px-4 text-center text-[black]">
        <p className="text-lg font-semibold">Không thể tải trang</p>
        <p className="text-sm text-[black]/60">
          Đã có lỗi xảy ra khi tải danh sách audio. Vui lòng thử lại.
        </p>
        <button
          type="button"
          onClick={loadHomeData}
          className="mt-2 rounded-lg bg-[#D6336C] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF3F7] border-y border-[#F1D6E0] text-[black]">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-4 py-5 sm:px-6 md:px-8 lg:px-20 xl:px-60">
        <div>
          <h1 className="text-3xl font-bold pb-2">Nghe gì hôm nay?</h1>
          <span className="text-sm">
            {totalAudio} audio · nghe miễn phí, không cần tài khoản
          </span>
        </div>

        <div ref={searchContainerRef} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (hasQuery) setIsSearchOpen(true);
            }}
            placeholder="Tìm audio..."
            className="pl-9 py-6 bg-white text-black"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-black"
            >
              <X className="size-4" />
            </button>
          )}

          {showDropdown && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[#F1D6E0] bg-white shadow-lg">
              {isDebouncePending || searchLoading ? (
                <p className="px-4 py-3 text-sm text-[black]/60">
                  Đang tìm kiếm...
                </p>
              ) : searchResults.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto py-1">
                  {searchResults.map((audio) => (
                    <li key={audio.id}>
                      <Link
                        href={`/${audio.id}`}
                        onClick={handleSelectResult}
                        className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-[#D6336C]/5"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D6336C]/12 text-[#D6336C]">
                          <Headphones size={16} />
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-[black]">
                            {audio.title}
                          </span>
                          <span className="text-xs text-[black]/50">
                            {formatListenCount(audio.totalListened)} lượt nghe
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-sm text-[black]/60">
                  Không tìm thấy audio nào phù hợp.
                </p>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-[black]/60">
            Đang tải...
          </p>
        ) : (
          <div className="ts-audio section mt-5 flex flex-col gap-10">
            <AudioSection title="Mới cập nhật" audio={newReleaseAudio} />
            <AudioSection title="Đang nghe nhiều" audio={trending} />
            <AudioSectionWithSort title="Top lượt nghe" audio={topListened} />
            <AllAudioSection />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePageClient;

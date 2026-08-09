function HomeLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFEAF2] pb-28">
      <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 md:px-8 lg:px-20 xl:px-70">
        <div className="mb-6 flex flex-col gap-2">
          <div className="h-8 w-48 animate-pulse rounded bg-white/10 sm:h-9 sm:w-64" />
          <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="aspect-square w-full animate-pulse rounded-xl bg-[#6ac1ab]/10" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeLoadingSkeleton;

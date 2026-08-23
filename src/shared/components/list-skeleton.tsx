/**
 * Skeleton dung chung cho `loading.tsx` cua 9 trang danh sach co form tim kiem (flights/transport/
 * experiences/tours/hotels/search/blog/destinations/guides) — mirror bo cuc chung (tieu de + thanh
 * tim kiem + luoi card), hien trong luc Server Component fetch data moi (lan dau vao trang lan
 * doi query qua GetSearchForm), thay cho IntroSplash phai phat lai o hard navigation cu.
 */
export function ListSkeleton({ columns = 3 }: { columns?: number }) {
  const gridColsClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-56 rounded-full bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full rounded-full bg-muted" />

      <div className="mt-6 h-24 rounded-[var(--radius-lg)] border border-border bg-card" />

      <div className={`mt-8 grid grid-cols-1 gap-4 ${gridColsClass}`}>
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
          >
            <div className="aspect-[4/3] bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded-full bg-muted" />
              <div className="h-3 w-1/2 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

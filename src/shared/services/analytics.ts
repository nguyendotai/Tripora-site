import { API_BASE_URL } from "@/configs/env";

/** V9 vong 4 — dung navigator.sendBeacon thay vi RTK Query cho tracking Search: form Hero Search
 * la native <form method="GET"> (load lai trang), khong phai SPA navigation, nen can 1 request
 * "ban xong khong doi phan hoi, song sot qua dieu huong trang" — dung y muc dich cua sendBeacon.
 * Cung ngoai le voi socket.ts (khong dung RTK Query khi cong cu do khong phu hop). */
export function trackSearchBeacon(params: { query: string; entityType: string; userId?: string }) {
  if (!params.query.trim()) return;
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;

  const payload = JSON.stringify({
    type: "SEARCH",
    query: params.query,
    entityType: params.entityType,
    ...(params.userId ? { userId: params.userId } : {}),
  });
  navigator.sendBeacon(
    `${API_BASE_URL}/analytics-events`,
    new Blob([payload], { type: "application/json" }),
  );
}

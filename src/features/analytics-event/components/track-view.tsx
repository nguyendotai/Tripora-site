"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useTrackEventMutation } from "../api/analytics-event.api";

/** V9 vong 4 — ghi nhan luot xem trang chi tiet san pham, khong render UI. Fire-and-forget,
 * khong hien loi neu that bai (best-effort, xem AnalyticsEventService o Backend). */
export function TrackView({ entityType, entityId }: { entityType: string; entityId: string }) {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [trackEvent] = useTrackEventMutation();

  useEffect(() => {
    trackEvent({ type: "VIEW", entityType, entityId, ...(userId ? { userId } : {}) });
  }, [entityType, entityId, userId, trackEvent]);

  return null;
}

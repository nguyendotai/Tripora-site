'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import { setCredentials, loadAuthFromStorage } from '@/features/auth';

/**
 * Khôi phục phiên đăng nhập từ localStorage nếu có — KHÔNG bắt buộc đăng nhập
 * (khác Admin), vì Frontend cho phép duyệt Destination/Property công khai không cần tài khoản.
 * Chỉ hành động đặt phòng mới yêu cầu đăng nhập (kiểm tra tại chỗ gọi, ví dụ booking-widget.tsx).
 */
export function SessionHydrator() {
  const isClient = useIsClient();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (!isClient || accessToken) return;

    const stored = loadAuthFromStorage();
    if (stored) {
      dispatch(setCredentials(stored));
    }
  }, [isClient, accessToken, dispatch]);

  return null;
}

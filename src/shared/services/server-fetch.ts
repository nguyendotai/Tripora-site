import { env } from '@/configs/env';
import type { ApiResponse } from './base-api';

/**
 * Fetch dùng riêng cho Server Component (SSR dữ liệu public — Destination/Property...).
 * Không dùng RTK Query ở đây vì RTK Query gắn với React Client Component lifecycle
 * (xem frontend/CLAUDE.md mục 2). Client Component vẫn bắt buộc dùng RTK Query.
 */
export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`serverFetch ${path} failed with status ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

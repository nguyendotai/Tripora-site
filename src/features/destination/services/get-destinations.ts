import { serverFetch } from '@/shared/services/server-fetch';
import type { Destination, PaginatedResult } from '../types/destination.types';

export async function getDestinations(params: { limit?: number } = {}): Promise<Destination[]> {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', String(params.limit));

  try {
    const result = await serverFetch<PaginatedResult<Destination>>(`/destinations?${query.toString()}`);
    return result.items;
  } catch {
    // Backend chưa chạy hoặc lỗi tạm thời — trang chủ vẫn render, chỉ rỗng phần Destination.
    return [];
  }
}

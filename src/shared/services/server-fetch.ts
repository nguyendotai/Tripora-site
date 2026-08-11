import { API_BASE_URL } from "@/configs/env";

export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    next: { revalidate: 60, ...(init as { next?: object })?.next },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

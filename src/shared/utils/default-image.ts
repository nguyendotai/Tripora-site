export type ImageCategory =
  | "hotel"
  | "room"
  | "tour"
  | "experience"
  | "destination"
  | "blog"
  | "guide";

// Room dung chung anh hotel vi la sub-entity cua Property, khong can anh rieng.
const DEFAULT_IMAGES: Record<ImageCategory, string> = {
  hotel: "https://images.unsplash.com/photo-1746549855427-57e6da7040db",
  room: "https://images.unsplash.com/photo-1746549855427-57e6da7040db",
  tour: "https://images.unsplash.com/photo-1766415007432-80738e830722",
  experience: "https://images.unsplash.com/photo-1709657179878-5c3e732a7832",
  destination: "https://images.unsplash.com/photo-1501927023255-9063be98970c",
  blog: "https://images.unsplash.com/photo-1576737064520-f45d313d17ff",
  guide: "https://images.unsplash.com/photo-1488628278511-2177a435414d",
};

// `size` chi gan query param crop cho anh mac dinh — anh that giu nguyen URL goc.
export function getImageOrDefault(
  images: string[] | null | undefined,
  category: ImageCategory,
  size?: { w: number; h: number },
): string {
  if (images?.[0]) return images[0];
  const base = DEFAULT_IMAGES[category];
  return size ? `${base}?w=${size.w}&h=${size.h}&fit=crop&q=80&auto=format` : base;
}

export function getCoverImageOrDefault(
  coverImage: string | null | undefined,
  category: ImageCategory,
  size?: { w: number; h: number },
): string {
  if (coverImage) return coverImage;
  const base = DEFAULT_IMAGES[category];
  return size ? `${base}?w=${size.w}&h=${size.h}&fit=crop&q=80&auto=format` : base;
}

export interface MockGuide {
  slug: string;
  title: string;
  excerpt: string;
  seed: string;
  readMinutes: number;
}

export const MOCK_GUIDES: MockGuide[] = [
  {
    slug: "an-gi-o-hoi-an",
    title: "Ăn gì ở Hội An: 10 món không thể bỏ lỡ",
    excerpt: "Từ cao lầu đến bánh mì Phượng, đây là danh sách ẩm thực đúng chất phố cổ.",
    seed: "tripora-guide-hoian",
    readMinutes: 6,
  },
  {
    slug: "sapa-mua-nao-dep-nhat",
    title: "Sa Pa mùa nào đẹp nhất để săn mây?",
    excerpt: "Lịch trình 3 ngày 2 đêm cho người mới lần đầu chinh phục Fansipan.",
    seed: "tripora-guide-sapa",
    readMinutes: 8,
  },
  {
    slug: "phu-quoc-tiet-kiem",
    title: "Du lịch Phú Quốc tiết kiệm cho người mới bắt đầu",
    excerpt: "Kinh nghiệm di chuyển, ở đâu, chơi gì cho chuyến đi ngân sách hợp lý.",
    seed: "tripora-guide-phuquoc",
    readMinutes: 5,
  },
];

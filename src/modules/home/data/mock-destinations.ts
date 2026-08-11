export interface MockDestination {
  slug: string;
  name: string;
  country: string;
  seed: string;
}

export const MOCK_DESTINATIONS: MockDestination[] = [
  { slug: "da-nang", name: "Đà Nẵng", country: "Việt Nam", seed: "tripora-danang" },
  { slug: "hoi-an", name: "Hội An", country: "Việt Nam", seed: "tripora-hoian" },
  { slug: "sapa", name: "Sa Pa", country: "Việt Nam", seed: "tripora-sapa" },
  { slug: "phu-quoc", name: "Phú Quốc", country: "Việt Nam", seed: "tripora-phuquoc" },
  { slug: "ha-long", name: "Hạ Long", country: "Việt Nam", seed: "tripora-halong" },
  { slug: "da-lat", name: "Đà Lạt", country: "Việt Nam", seed: "tripora-dalat" },
];

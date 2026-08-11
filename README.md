# Tripora Frontend

App Next.js hướng Traveler/Guest của Tripora — khám phá điểm đến, đọc cẩm nang, lập lịch trình. Roadmap theo phase: xem `../phases/README.md` (V1 → V9).

## Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS v4, Redux Toolkit + RTK Query, React Hook Form + Zod, shadcn/ui (`base-nova`), `motion`, next-themes (Light/Dark/System).

Xem quy tắc phát triển đầy đủ tại `CLAUDE.md` và `../.claude/*.md`.

## Getting Started

```bash
npm install
npm run dev
```

Mở [http://localhost:3003](http://localhost:3003) (port cố định — xem `package.json` script `dev`/`start` — để chạy song song `backend/` ở `5550` và `admin/` ở `3002`).

## Cấu trúc thư mục
```
src/
  app/         # App Router: layout, page, providers (Theme)
  modules/     # module theo tính năng (ví dụ home/)
  shared/      # components dùng chung (logo, navbar, footer, theme-toggle...)
  components/  # shadcn/ui
  lib/         # utils (cn...)
```

## Scripts
- `npm run dev` — chạy dev server tại port `3003`
- `npm run build` — build production
- `npm run start` — chạy bản build tại port `3003`
- `npm run lint` — lint

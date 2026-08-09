# Tripora Frontend

App Next.js hướng Traveler (tìm kiếm/đặt Property, Product, xem Trip, Review, Wishlist, Chat) của Tripora — Booking/Travel Platform.

## Tech Stack
Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit + RTK Query, React Hook Form + Zod, shadcn/ui, next-themes (Light/Dark/System), Socket.IO Client.

Xem quy tắc phát triển đầy đủ tại `CLAUDE.md` và `../.claude/*.md` (`business-rules.md`, `architecture.md`, `folder-structure.md`, `api-contract.md`).

## Getting Started

```bash
npm install
cp .env.example .env.local   # trỏ NEXT_PUBLIC_API_BASE_URL sang backend
npm run dev
```

Mở http://localhost:3000.

## Cấu trúc thư mục
```
src/
  app/         # App Router: layout, page, providers (Redux + Theme)
  features/    # mỗi nghiệp vụ 1 thư mục (auth, ...) — api/components/hooks/store/schemas
  modules/     # ghép nhiều feature thành 1 module giao diện
  shared/      # components (kể cả shadcn/ui), hooks, services, lib, utils dùng chung ≥2 feature
  store/       # store.ts, root-reducer.ts (Redux Slice nằm trong từng feature)
  configs/     # env, axios/socket config
  constants/
  styles/
```

## Design System
Xem `CLAUDE.md` mục 6 — Light (mặc định)/Dark/System, brand đỏ cam `#E5402C`, token khai báo tại `src/app/globals.css`.

## Scripts
- `npm run dev` — chạy dev server
- `npm run build` — build production
- `npm run lint` — lint

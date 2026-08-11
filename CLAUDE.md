# Frontend Claude Instructions
> Tripora — Frontend (Traveler-facing). Roadmap theo phase: xem `../phases/README.md` (V1 → V9).

Tài liệu quy định tiêu chuẩn phát triển `frontend/` — app hướng Traveler/Guest. Phạm vi tính năng hiện tại bám theo phase đang làm (xem checklist "Frontend" trong file phase tương ứng ở `../phases/`): **V1** — Home, Destinations, Travel Guide, Blog, Search, Trip Planner, Review, Wishlist. Các tính năng đặt dịch vụ (Hotel/Tour/Transport/Flight), Checkout, Social, Chat chỉ thêm khi tới phase tương ứng — không code trước. AI phải tuân thủ cả `.claude/` gốc (ưu tiên: Business Rules -> Architecture -> `frontend/CLAUDE.md` -> Coding Style -> Folder Structure). Xem thêm `AGENTS.md` (tự sinh bởi `next dev`/`next build`) cho lưu ý riêng về phiên bản Next.js đang dùng.

## 1. Tech Stack & Framework
- React, Next.js (App Router, cấm Pages Router, cấm API Route FE), TypeScript (strict-mode, cấm `any`/`as`), Tailwind CSS (Mobile First, cấm CSS thuần/`!important`), Redux Toolkit, RTK Query, React Hook Form, Zod, Framer Motion (`motion/react`), shadcn/ui.
- React: Functional Component + Hooks. Cấm Class Component/Legacy Context. Component <300 dòng.
- **Design quality**: khi viết/chỉnh giao diện BẮT BUỘC áp dụng skill `.agents/skills/design-taste-frontend/SKILL.md` (đã cài) để tránh giao diện "nhìn kiểu AI" (gradient tím mặc định, 3 card đều nhau, em-dash, Inter mặc định...). Skill này **chỉ áp dụng cho `frontend/`**, không dùng cho `admin/`.

## 2. State Management & API Calls
- **Server Data (Client Component)**: quản lý bằng **RTK Query** (Query, Mutation, Cache, Tags, Invalidate Cache). *Cấm dùng useState/Redux Slice để lưu data Server*. *Cấm dùng Axios, fetch() trực tiếp trong Client Component*.
- **Server Data (Server Component, đọc dữ liệu public phục vụ SSR/SEO)**: gọi qua helper dùng chung `shared/services/server-fetch.ts` — vẫn cấm gọi `fetch()`/Axios rải rác, phải qua đúng 1 helper. Dữ liệu cần tương tác lại (filter, phân trang client-side, mutation) chuyển sang Client Component + RTK Query.
- **Global UI State**: Redux Toolkit (Auth, Theme, Sidebar, Modal, Notification). State cục bộ dùng useState/useReducer.
- **API Layer**: đặt trong `features/<feature>/api/`. Cấm chứa business logic.

## 3. Business Logic, Validation & Server Components
- **Business Logic**: nằm trong `services/`/`hooks/`. Cấm viết trong Component/Page/Layout.
- **Validation**: **Zod Schema** trong `schemas/`. Cấm validate JavaScript thuần trong Component.
- **React Hook Form**: dùng cho mọi Form nhiều bước/phức tạp — phải có Default Value, Validation, Loading/Error State.
- **Server Component**: ưu tiên mặc định (trang danh sách/detail công khai nên SSR để SEO tốt). Chỉ dùng `"use client"` khi cần useState/useEffect/Event Handler/Browser API/Animation/Realtime.
- **Shared**: chỉ đưa vào `shared/` khi có ít nhất 2 feature cùng dùng.

## 4. UX, Accessibility & Performance
- **UX**: đầy đủ Loading State (Skeleton/Spinner), Empty State, Error State (có Retry). Luồng nhiều bước (đặt chỗ, checkout khi tới phase có) phải rõ ràng từng bước, tránh double-submit.
- **Accessibility**: bắt buộc nhãn Form, Keyboard Navigation, Focus State, Aria Attributes.
- **Performance**: Lazy loading, Dynamic Import, Memo, Virtual List (danh sách dài), Next.js Image.
- **CẤM**: Axios, gọi API trực tiếp trong UI, logic nghiệp vụ trong JSX, validation trong component, `"use client"` thừa, CSS thủ công, tự tính lại giá/số liệu tài chính ở Frontend (luôn lấy nguyên giá trị Backend trả về, không suy diễn lại).

## 5. DOD (Definition of Done)
Build thành công; không lỗi TS/ESLint; Responsive; đủ UI States; không đổi code ngoài phạm vi; cập nhật `CHANGELOG.md`, `PROJECT_STATUS.md`, và % trong file phase tương ứng ở `../phases/`.

## 6. Design System (Brand Tripora — áp dụng xuyên suốt mọi phase)
> Bản sắc thương hiệu Tripora (logo, màu, typography, component pattern) áp dụng cho toàn bộ `frontend/` bất kể phase đang làm — chỉ nội dung/tính năng thay đổi theo roadmap, không phải màu sắc/phong cách. Phân tích gốc từ ảnh reference phong cách "Travel Booking Landing" (nền sáng chủ đạo, Hero ảnh nền phủ overlay tối, card bo lớn) — **chỉ lấy bố cục/tỉ lệ/thành phần UI, không copy thương hiệu/màu trong ảnh gốc**, màu thật lấy từ logo chính thức (6.3). Biến CSS khai báo tại `:root` (Light) và `.dark` (Dark) trong `src/app/globals.css`, đúng convention shadcn/ui.

### 6.1 Border Radius Scale
| Token | ~Px | Dùng cho |
| :--- | :--- | :--- |
| `--radius-sm` | 8px | input, checkbox, badge nhỏ |
| `--radius-md` | 12px | icon-button, logo tròn nhỏ |
| `--radius-lg` (base) | 16px | Card nội dung chính (Destination/Trip/Blog Card) |
| `--radius-xl` | 24px | Search Widget (Card nổi trên Hero), ảnh Popular Destination |
| `--radius-2xl` | 32px | Section lớn/khối banner |
| `rounded-full` (Tailwind) | 9999px | Button (Search, CTA, Sign In), Badge/Tag, Avatar/Logo tròn, Tab pill |

Quy tắc: Card nội dung dùng `rounded-[var(--radius-lg)]`, ảnh Popular Destination/Search Widget dùng `rounded-[var(--radius-xl)]`, mọi Button chính + Badge dùng `rounded-full`. Cấm bo góc < 8px trừ input/checkbox nhỏ.

### 6.2 Background & Surface
- **Light (mặc định)**: nền trang trắng/xám rất nhạt (`--background`), Card nền trắng đặc + shadow nhẹ (không glassmorphism/backdrop-blur).
- **Dark (suy ra theo tông thương hiệu)**: nền tối navy gần đen, Card tối hơn nền 1 bậc kèm border mờ, shadow nhẹ (không glow lớn).
- **Hero Section**: ảnh nền + lớp phủ tối (`linear-gradient(180deg, rgba(10,14,23,.5) 0%, rgba(10,14,23,.85) 100%)`) — **cố định như nhau ở cả Light lẫn Dark theme**, không đổi theo token nền chính.
- **Trusted-by / Partner Strip**: nền đặc màu Brand navy, logo/chữ trắng mờ — cũng cố định 2 theme như Hero, hardcode thẳng `#14365C` thay vì biến `--primary`.

### 6.3 Color Tokens
> Lấy từ logo chính thức (`frontend/public/logo.png`, `frontend/public/logo-icon.png`): Navy `#14365C` (icon la bàn + wordmark) + Teal `#0C8788` (vệt swoosh).

| Token | Light | Dark |
| :--- | :--- | :--- |
| `--background` | `#FFFFFF` | `#0B0F17` |
| `--foreground` | `#14171F` | `#F4F5F7` |
| `--card` | `#FFFFFF` | `#141822` |
| `--card-foreground` | `#14171F` | `#F4F5F7` |
| `--popover` | `#FFFFFF` | `#141822` |
| `--primary` (Brand navy) | `#14365C` | `#3D6FA8` (lightened cho đủ contrast trên nền Dark gần đen) |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--secondary` | `#F3F4F6` | `#1B2029` |
| `--secondary-foreground` | `#14171F` | `#E7E9EE` |
| `--muted` | `#F6F7F9` | `#171B24` |
| `--muted-foreground` | `#6B7280` | `#8B93A3` |
| `--accent` (tint teal nhạt hover/badge) | `#E3F5F4` | `#0F2C2C` |
| `--accent-foreground` (Brand teal) | `#0C8788` | `#3FD9D0` |
| `--destructive` | `#DC2626` | `#F87171` |
| `--border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |
| `--input` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.10)` |
| `--ring` | `#14365C` | `#3D6FA8` |
| `--chart-1`/`--chart-2` | `#14365C` / `#0C8788` | `#3D6FA8` / `#3FD9D0` |
| success / info / warning / purple (badge) | `#16A34A` / `#2563EB` / `#F59E0B` / `#7C3AED` | `#22C55E` / `#60A5FA` / `#FBBF24` / `#A78BFA` |

### 6.4 Brand Color & Effect
- **Brand chính**: navy `#14365C` (Button chính, Tab active, giá/số liệu nổi bật, Trusted-by banner) + **Teal `#0C8788`** làm màu nhấn phụ. Navy quá tối cho nền Dark gần đen nên `--primary`/`--ring`/`--chart-1` ở Dark dùng bản sáng hơn `#3D6FA8`.
- Button chính: nền đặc `--primary`, chữ trắng, `rounded-full`, hover tăng nhẹ độ đậm/shadow navy mờ — không glow lớn kiểu glassmorphism.
- Card: shadow nhẹ (`0 2px 12px rgba(0,0,0,.06)` Light, `0 2px 12px rgba(0,0,0,.4)` Dark), viền `--border` mờ, không backdrop-blur.
- Badge/Tag (info/warning/purple/success) dùng nền nhạt (10-15% opacity) của màu tương ứng, chữ đậm.
- **Logo**: component dùng chung `shared/components/logo.tsx` — `public/logo-icon.png` (icon) cạnh text "Tripora". `public/logo.png` (full lockup) dự phòng cho vị trí cần logo lớn/độc lập.

### 6.5 Component Pattern (áp dụng cho entity của phase đang làm)
- **Navbar**: nền `--background` đặc, logo + icon nhấn `--primary`, menu ngang, icon search, nút viền "Sign In" (`rounded-full`) + nút đặc navy pill (CTA chính).
- **Hero**: ảnh nền full-width + overlay tối (6.2), heading trắng lớn/bold, **Search Widget** Card nổi (`--radius-xl`, shadow lớn) đè mép dưới Hero.
- **Popular Destinations**: grid ảnh `--radius-xl`, overlay gradient tối đáy ảnh để tên địa danh (chữ trắng) luôn rõ.
- **Trusted-by / Partner Strip**: dải nền đặc `--primary`, logo đối tác trắng/mờ trắng.
- **Content Card** (Destination/Trip/Blog ở V1; Property/Tour/Flight khi tới phase tương ứng): Card trắng bo `--radius-lg`, ảnh trên cùng bo góc trên, badge nhỏ góc trái ảnh, nội dung dưới gồm tên + địa điểm, rating dạng pill góc phải; **giá tiền** (khi có, từ V2) nổi bật màu `--primary` góc phải dưới.
- **Highlight Badge Row**: 3 Card ngang nhỏ, icon tròn màu riêng bên trái, tiêu đề + mô tả ngắn bên phải, nền `--secondary`/`--muted`, bo `--radius-lg`.

### 6.6 Typography Accent
- **Font**: `Google Sans` (text) + `Google Sans Code` (monospace) qua `next/font/google`, khai báo `src/app/layout.tsx` với `variable: "--font-sans"`/`"--font-mono"`. Subsets bắt buộc `latin` + `vietnamese`. Không tự đổi font khi chưa có yêu cầu.
- Heading Hero: `text-4xl`~`text-6xl`, bold/extrabold, luôn trắng trên overlay tối.
- Heading Section: bold, có thể gạch chân ngắn (`border-bottom` 2-3px `--primary`) dưới đúng 1 từ khoá nhấn mạnh.
- Giá tiền/số liệu nhấn mạnh: `--primary`, bold, cỡ lớn hơn text xung quanh.
- Meta (ngày, địa điểm): `text-xs`/`text-sm`, `--muted-foreground`, kèm icon 12-14px.

### 6.7 Theme: Light / Dark / System (bắt buộc đủ 3 chế độ)
- `next-themes` (`attribute="class"`, `defaultTheme="light"`, `enableSystem`). `ThemeToggle` dùng chung ở `shared/components/`, dropdown **3 lựa chọn** Light/Dark/System.
- Hero/Trusted-by Strip là ngoại lệ cố định (6.2) — không đổi theo theme.

### 6.8 Áp dụng
Mọi Card/Button/Badge mới bắt buộc dùng token ở trên qua Tailwind theme. Cấm hardcode mã màu/bo góc tuỳ tiện, trừ 2 ngoại lệ cố định (Hero overlay, Trusted-by Strip). Tên thương hiệu, logo, nội dung marketing luôn là **Tripora**.

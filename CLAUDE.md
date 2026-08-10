# Frontend Claude Instructions
> Version: 1.0 (Tripora - Booking Platform, Traveler-facing)

Tài liệu quy định toàn bộ tiêu chuẩn phát triển Frontend dự án Tripora (`frontend/` — app hướng Traveler: tìm kiếm/đặt Property, Product, xem Trip, Review, Wishlist, Chat). AI phải tuân thủ cả tài liệu `.claude/` (ưu tiên theo thứ tự: Business Rules -> Architecture -> frontend/CLAUDE.md -> Coding Style -> Folder Structure).

## 1. TECH STACK & FRAMEWORK
- React, Next.js (App Router, cấm Pages Router, cấm API Route FE), TypeScript (strict-mode, cấm `any`/`as`), Tailwind CSS (Mobile First, cấm CSS thuần/`!important`), Redux Toolkit, RTK Query, React Hook Form, Zod, Framer Motion, shadcn/ui.
- React: Functional Component + Hooks. Cấm Class Component/Legacy Context. Component <300 dòng.
- **Design quality**: Khi viết/chỉnh giao diện (landing page, trang danh sách Destination/Property/Product, trang marketing) BẮT BUỘC áp dụng skill `.claude/skills/design-taste-frontend/SKILL.md` (đã cài — xem `SOURCE.md` cùng thư mục) để tránh giao diện "nhìn kiểu AI" (gradient tím mặc định, 3 card đều nhau, em-dash, Inter mặc định...). Skill này **chỉ áp dụng cho `frontend/`**, không dùng cho `admin/` (tự khai báo không dành cho dashboard/data table).

## 2. STATE MANAGEMENT & API CALLS
- **Server Data (Client Component)**: Quản lý bằng **RTK Query** (Query, Mutation, Cache, Tags, Invalidate Cache — ví dụ: invalidate `RoomAvailability` sau khi tạo Booking). *Cấm dùng useState, Redux Slice để lưu data Server*. *Cấm dùng Axios, fetch() trực tiếp trong Client Component*.
- **Server Data (Server Component, đọc dữ liệu public phục vụ SSR/SEO — ví dụ danh sách Destination/Property)**: Được phép gọi thẳng qua helper dùng chung `shared/services/server-fetch.ts` (không phải RTK Query, vì RTK Query gắn với React Client Component lifecycle) — vẫn cấm gọi `fetch()`/Axios rải rác tùy tiện, phải qua đúng 1 helper này để giữ format response/env base URL nhất quán. Dữ liệu cần tương tác lại (filter, phân trang client-side, mutation) vẫn phải chuyển sang Client Component + RTK Query.
- **Global UI State**: Quản lý bằng **Redux Toolkit** (chỉ dùng cho Auth, Theme, Sidebar, Modal, Notification, giỏ đặt chỗ tạm/Booking Draft trước khi submit). State cục bộ dùng useState/useReducer.
- **API Layer**: Đặt trong `features/<feature>/api/` để định nghĩa endpoint/cache/map data. Cấm chứa business logic.

## 3. BUSINESS LOGIC, VALIDATION & SERVER COMPONENTS
- **Business Logic**: Phải nằm trong `services/` hoặc `hooks/`. Cấm viết trong Component/Page/Layout.
- **Validation**: Dùng **Zod Schema** đặt trong `schemas/`. Cấm viết validate JavaScript thuần trong Component.
- **React Hook Form**: Dùng cho Form (đặc biệt Form đặt phòng nhiều bước, Form thanh toán). Phải có: Default Value, Validation, Loading/Error State.
- **Server Component**: Ưu tiên mặc định (trang danh sách Property/Destination nên SSR để SEO tốt). Chỉ dùng `"use client"` khi cần useState, useEffect, Event Handler, Browser API, Animation, Realtime (Socket.IO — cập nhật availability/booking status).
- **Shared**: Chỉ đưa vào `shared/` khi có ít nhất 2 feature cùng sử dụng.

## 4. UX, ACCESSIBILITY & PERFORMANCE
- **UX**: Đảm bảo đầy đủ Loading State (Skeleton, Spinner), Empty State, Error State (có Retry) — đặc biệt luồng Booking/Payment phải rõ ràng từng bước, tránh double-submit (disable nút khi đang gọi API tạo Booking/Payment).
- **Accessibility**: Bắt buộc nhãn Form, Keyboard Navigation, Focus State, Aria Attributes.
- **Performance**: Lazy loading, Dynamic Import, Memo, Virtual List (danh sách Property/Product dài), Next.js Image (ảnh Property/Room qua Cloudinary).
- **CẤM**: Axios, gọi API trực tiếp trong UI, Logic nghiệp vụ trong JSX, Validation trong component, "use client" thừa, CSS thủ công, tự tính lại giá Booking đã CONFIRMED ở Frontend (giá luôn lấy từ snapshot BookingItem trả về từ Backend).

## 5. DOD (DEFINITION OF DONE)
Build thành công; không lỗi TS/ESLint; Responsive; có đủ UI States; không đổi code ngoài phạm vi; cập nhật CHANGELOG.md và PROJECT_STATUS.md.

## 6. DESIGN SYSTEM (LANDING / DISCOVERY REFERENCE)
> Phân tích từ ảnh reference phong cách "Travel Booking Landing" (nền sáng chủ đạo, Hero ảnh nền phủ overlay tối, card bo lớn, brand đỏ cam rực). **Chỉ lấy bố cục/tỉ lệ/màu sắc/thành phần UI làm tham chiếu — KHÔNG copy tên thương hiệu/logo trong ảnh, giữ nguyên tên & nội dung Tripora.** Áp dụng cho Landing Page, Destination/Property/Product listing, Search Widget. Biến CSS khai báo tại `:root` (Light, mặc định) và `.dark` (Dark) trong `src/app/globals.css`, đúng convention shadcn/ui.

### 6.1 Border Radius Scale
| Token | ~Px | Dùng cho |
| :--- | :--- | :--- |
| `--radius-sm` | 8px | input, checkbox, badge nhỏ |
| `--radius-md` | 12px | icon-button, logo tròn nhỏ |
| `--radius-lg` (base) | 16px | Feature Card (Flight/Tour/Property), Provider Card |
| `--radius-xl` | 24px | Search Widget (Card nổi trên Hero), ảnh Popular Location |
| `--radius-2xl` | 32px | Section lớn/khối banner |
| `rounded-full` (Tailwind, không qua token) | 9999px | Button (Search, CTA, Sign In), Badge/Tag, Avatar/Logo tròn, Tab pill |

Quy tắc: Card nội dung dùng `rounded-[var(--radius-lg)]`, ảnh Popular Location/Search Widget dùng `rounded-[var(--radius-xl)]`, mọi Button chính + Badge dùng `rounded-full`. Cấm bo góc < 8px trừ input/checkbox nhỏ.

### 6.2 Background & Surface
- **Light (mặc định, khớp ảnh mẫu)**: nền trang trắng/xám rất nhạt (`--background`), Card nền trắng đặc + shadow nhẹ (không glassmorphism/backdrop-blur — phong cách ảnh "clean/editorial", khác hẳn dự án cũ).
- **Dark (suy ra theo tông thương hiệu, ảnh mẫu không có ví dụ Dark thật)**: nền tối navy gần đen, Card tối hơn nền 1 bậc kèm border mờ, vẫn dùng shadow nhẹ (không glow lớn).
- **Hero Section**: luôn là ảnh nền + lớp phủ tối (`linear-gradient(180deg, rgba(10,14,23,.5) 0%, rgba(10,14,23,.85) 100%)`) để chữ trắng nổi bật — **cố định như nhau ở cả Light lẫn Dark theme**, không đổi theo token nền chính (giống 1 section ảnh độc lập, không phải "Dark mode toàn trang").
- **Trusted-by / Partner Strip**: nền đặc màu Brand đỏ (`--primary`), logo đối tác trắng/mờ trắng — cũng cố định 2 theme như Hero.

### 6.3 Color Tokens
| Token | Light | Dark |
| :--- | :--- | :--- |
| `--background` | `#FFFFFF` | `#0B0F17` |
| `--foreground` | `#14171F` | `#F4F5F7` |
| `--card` | `#FFFFFF` | `#141822` |
| `--card-foreground` | `#14171F` | `#F4F5F7` |
| `--popover` | `#FFFFFF` | `#141822` |
| `--primary` (Brand đỏ cam) | `#E5402C` | `#E5402C` (giữ nguyên, không đổi theo theme) |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--secondary` | `#F3F4F6` | `#1B2029` |
| `--secondary-foreground` | `#14171F` | `#E7E9EE` |
| `--muted` | `#F6F7F9` | `#171B24` |
| `--muted-foreground` | `#6B7280` | `#8B93A3` |
| `--accent` (nền tint đỏ nhạt cho hover/badge) | `#FFF1EF` | `#2A1512` |
| `--accent-foreground` | `#E5402C` | `#FF8A75` |
| `--destructive` | `#DC2626` | `#F87171` |
| `--border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |
| `--input` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.10)` |
| `--ring` | `#E5402C` | `#E5402C` |
| success (rating star, badge "Best Price") | `#16A34A` | `#22C55E` |
| info (badge loại chuyến/loại hình) | `#2563EB` | `#60A5FA` |
| warning (badge VIP/nổi bật) | `#F59E0B` | `#FBBF24` |
| purple (badge gói/ưu đãi) | `#7C3AED` | `#A78BFA` |

### 6.4 Brand Color & Effect
- **Brand chính**: đỏ cam `#E5402C` (tham chiếu trực tiếp từ ảnh mẫu — dùng cho Button chính, Tab active, giá tiền nổi bật, Trusted-by banner). Dùng **nhất quán ở cả 2 theme** (không đổi sắc theo Light/Dark, chỉ nền/Card xung quanh đổi) để giữ nhận diện thương hiệu.
- Button chính: nền đặc `--primary`, chữ trắng, `rounded-full`, hover tăng nhẹ độ đậm/shadow màu đỏ mờ — không dùng glow lớn kiểu glassmorphism.
- Card: shadow nhẹ (`0 2px 12px rgba(0,0,0,.06)` Light, `0 2px 12px rgba(0,0,0,.4)` Dark), viền `--border` mờ, không backdrop-blur.
- Badge/Tag nhiều màu (info/warning/purple/success ở 6.3) dùng cho phân loại (loại chuyến, gói ưu đãi, đánh giá) — nền là bản nhạt (10-15% opacity) của màu tương ứng, chữ là bản đậm.

### 6.5 Component Pattern quan sát từ ảnh
- **Navbar**: nền `--background` đặc, logo + icon nhấn màu `--primary`, menu ngang, icon search, nút viền "Sign In" (`border`, `rounded-full`) + nút đặc đỏ pill (CTA chính, `rounded-full`).
- **Hero**: ảnh nền full-width + overlay tối (xem 6.2), heading trắng rất lớn/bold (có thể chèn icon/emoji nhấn giữa câu), **Search Widget** là 1 Card nổi (`--radius-xl`, shadow lớn) đè lên mép dưới Hero — Tabs ngang chọn loại dịch vụ (Property/Product/...), tab active có nền/underline `--primary`, các field tìm kiếm + nút Search (`rounded-full`, nền `--primary`) nằm cuối hàng.
- **Popular Destinations**: grid ảnh `--radius-xl`, overlay gradient tối ở đáy ảnh để tên địa danh (chữ trắng) luôn đọc rõ; có thể có 1 ô là nút tròn "Xem thêm" (mũi tên, nền `--primary`).
- **Trusted-by / Partner Strip**: dải nền đặc `--primary`, logo đối tác trắng/mờ trắng, chữ giới thiệu nhỏ ở giữa.
- **Feature Card (Property/Product)**: Card trắng bo `--radius-lg`, ảnh trên cùng bo góc trên, badge nhỏ góc trái ảnh (loại hình, màu theo bảng badge 6.3), nội dung dưới gồm tên + địa điểm/tuyến, ngày, rating dạng pill góc phải, **giá tiền** nổi bật màu `--primary` góc phải dưới.
- **Top Rated Partner/Provider**: Card ngang nhỏ, logo tròn bên trái, tên + rating sao + số liệu phụ (số Property/Product) bên phải, viền mỏng `--border`, bo `--radius-lg`.
- **Highlight Badge Row** (kiểu "VIP/Ưu đãi/Cam kết giá tốt"): 3 Card ngang nhỏ, icon tròn màu riêng (theo bảng badge 6.3) bên trái, tiêu đề + mô tả ngắn bên phải, nền `--secondary`/`--muted`, bo `--radius-lg`.
- **Stats Teaser (trước Footer)**: nền tối cố định (giống Hero, không đổi theo theme), số liệu lớn bold trắng (ví dụ "X+ Destinations") + label nhỏ mờ bên dưới.

### 6.6 Typography Accent
- **Font chữ**: `Google Sans` (text) + `Google Sans Code` (monospace) qua `next/font/google`, khai báo ở `src/app/layout.tsx` với `variable: "--font-sans"`/`"--font-mono"` (khớp trực tiếp token Tailwind, không đặt tên khác như `--font-geist-sans`). Subsets bắt buộc gồm `latin` + `vietnamese`. Không tự đổi sang font khác khi chưa có yêu cầu.
- Heading Hero: `text-4xl`~`text-6xl`, bold/extrabold, luôn màu trắng trên overlay tối (bất kể theme).
- Heading Section: bold, có thể gạch chân ngắn (`border-bottom` 2-3px màu `--primary`) dưới đúng 1 từ khoá nhấn mạnh — không gạch chân cả tiêu đề.
- Giá tiền: `--primary`, bold, cỡ lớn hơn text thường xung quanh.
- Meta (ngày, địa điểm, số liệu phụ): `text-xs`/`text-sm`, `--muted-foreground`, kèm icon 12-14px.

### 6.7 Theme: Light / Dark / System (bắt buộc đủ 3 chế độ)
- Dùng `next-themes` (`attribute="class"`, `defaultTheme="light"` — khớp ảnh mẫu vốn là Light, `enableSystem`). `ThemeToggle` dùng chung ở `shared/components/` phải là dropdown/menu **3 lựa chọn** Light/Dark/System (không phải switch 2 trạng thái).
- **Light**: áp dụng đúng bảng token ở 6.3 cột Light (từ ảnh mẫu thật).
- **Dark**: áp dụng bảng token ở 6.3 cột Dark — đây là **suy luận giữ tông thương hiệu** (ảnh mẫu không có ví dụ Dark), cần duyệt lại với người dùng khi có ảnh/yêu cầu Dark cụ thể hơn thay vì coi là quyết định cuối cùng.
- **System**: theo `prefers-color-scheme` của OS, tự chuyển Light/Dark tương ứng, không cần token riêng.
- Hero/Trusted-by Strip là ngoại lệ cố định (xem 6.2) — không đổi theo theme dù Light/Dark/System.

### 6.8 Áp dụng
Mọi Card/Button/Badge mới bắt buộc dùng token ở trên qua Tailwind theme (`bg-card`, `text-muted-foreground`, `rounded-[var(--radius-lg)]`...). Cấm hardcode mã màu/bo góc tuỳ tiện trong Component, trừ 2 ngoại lệ cố định đã nêu (Hero overlay, Trusted-by Strip). Tên thương hiệu, logo, nội dung marketing luôn là **Tripora** — ảnh tham khảo chỉ dùng để học phong cách trình bày.

import { BadgePercent, Headset, ShieldCheck } from "lucide-react";
import { Logo } from "@/shared/components/logo";

const HIGHLIGHTS = [
  { icon: ShieldCheck, text: "Thanh toán an toàn, bảo mật chuẩn quốc tế" },
  { icon: Headset, text: "Hỗ trợ khách hàng 24/7" },
  { icon: BadgePercent, text: "Ưu đãi độc quyền dành riêng cho thành viên" },
];

/** Panel trai layout split-screen — chi hien tren desktop (lg+), dung dung token mau san co
 * (--primary/--accent), khong tao palette moi, khong can anh moi. */
export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent-foreground/40" />

      <div className="relative">
        <Logo light />
      </div>

      <div className="relative space-y-8">
        <h2 className="text-3xl font-bold text-balance">
          Khám phá thế giới, đặt chỗ an tâm
        </h2>
        <p className="max-w-sm text-primary-foreground/80">
          Hàng nghìn khách sạn, tour, trải nghiệm và chuyến bay — tất cả trong
          một nền tảng.
        </p>

        <ul className="space-y-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm text-primary-foreground/90">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} Tripora
      </div>
    </div>
  );
}

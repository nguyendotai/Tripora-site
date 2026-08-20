import { Building2, Car, Compass, Plane, Ticket } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const CATEGORIES = [
  { href: "/hotels", label: "Khách sạn", icon: Building2 },
  { href: "/tours", label: "Tour", icon: Compass },
  { href: "/experiences", label: "Trải nghiệm", icon: Ticket },
  { href: "/transport", label: "Đặt xe", icon: Car },
  { href: "/flights", label: "Chuyến bay", icon: Plane },
];

export function CategoryNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
        {CATEGORIES.map(({ href, label, icon: Icon }, index) => (
          <ScrollReveal key={href} delay={index * 0.06}>
            <Link
              href={href}
              className="group flex flex-col items-center gap-2.5 rounded-[var(--radius-lg)] border border-border bg-card p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold">{label}</p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

import { Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@tripora.dev",
    href: "mailto:hello@tripora.dev",
  },
  {
    icon: Phone,
    title: "Hotline",
    value: "1900 1234",
    href: "tel:19001234",
  },
  {
    icon: MapPin,
    title: "Văn phòng",
    value: "Đà Nẵng, Việt Nam",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Liên hệ
            </p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Chúng tôi luôn sẵn sàng lắng nghe
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Có câu hỏi, góp ý hay cần hỗ trợ? Liên hệ với đội ngũ Tripora qua
              các kênh dưới đây.
            </p>
          </ScrollReveal>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {CONTACT_CHANNELS.map(({ icon: Icon, title, value, href }, index) => (
              <ScrollReveal key={title} delay={index * 0.1}>
                <div className="flex h-full flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

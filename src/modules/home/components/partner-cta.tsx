import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/shared/components/ui/button';
import { ScrollReveal } from '@/shared/components/scroll-reveal';
import { cn } from '@/shared/lib/utils';

export function PartnerCta() {
  return (
    <section className="bg-[#0B0F17] py-16 text-white sm:py-24">
      <ScrollReveal>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Bạn có chỗ ở hoặc tour muốn đưa lên Tripora?
          </h2>
          <p className="max-w-xl text-white/70">
            Đăng ký làm đối tác để quản lý phòng, lịch tour và nhận đặt chỗ trực tiếp từ khách du lịch.
          </p>
          <Link
            href="/become-partner"
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'rounded-full')}
          >
            Trở thành đối tác
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

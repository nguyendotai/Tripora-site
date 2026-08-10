import { Compass } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
        <Compass className="size-4.5" strokeWidth={2} />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">Tripora</span>
    </Link>
  );
}

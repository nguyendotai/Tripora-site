import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo-icon.png" alt="" width={32} height={32} className="size-8" priority />
      <span className="text-lg font-bold tracking-tight text-foreground">Tripora</span>
    </Link>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo-icon.png" alt="" width={42} height={42} className="size-[42px]" priority />
      <span className="text-lg font-bold tracking-tight text-foreground">Tripora</span>
    </Link>
  );
}

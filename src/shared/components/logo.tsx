import Image from "next/image";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 ${className ?? ""}`}
    >
      <Image
        src="/logo-icon.png"
        alt="Tripora"
        width={36}
        height={36}
        priority
        className="h-9 w-9 object-contain"
      />
      <span className="text-xl font-bold tracking-tight text-primary">
        Tripora
      </span>
    </Link>
  );
}

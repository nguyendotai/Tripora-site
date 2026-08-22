import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function ContactProviderCard({
  provider,
}: {
  provider?: { id: string; name: string } | null;
}) {
  if (!provider) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <h3 className="font-semibold">Đối tác</h3>
      <p className="mt-2 text-sm text-muted-foreground">{provider.name}</p>
      <Link
        href={`/messages/new?providerId=${provider.id}&providerName=${encodeURIComponent(provider.name)}`}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        <MessageCircle className="h-4 w-4" />
        Liên hệ đối tác
      </Link>
    </div>
  );
}

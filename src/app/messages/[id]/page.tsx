"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useListMyConversationsQuery } from "@/features/conversation/api/conversation.api";
import { MessageComposer } from "@/features/conversation/components/message-composer";
import { MessageThread } from "@/features/conversation/components/message-thread";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function ConversationThread({ conversationId }: { conversationId: string }) {
  const { data } = useListMyConversationsQuery();
  const conversation = data?.find((c) => c.id === conversationId);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/messages"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Tin nhắn
        </Link>

        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <div className="border-b border-border p-4">
            <p className="font-semibold">{conversation?.provider.name ?? "Cuộc trò chuyện"}</p>
          </div>
          <MessageThread conversationId={conversationId} />
          <MessageComposer conversationId={conversationId} />
        </div>
      </div>
    </main>
  );
}

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <>
      <Navbar />
      <RequireAuth>
        <ConversationThread conversationId={id} />
      </RequireAuth>
      <Footer />
    </>
  );
}

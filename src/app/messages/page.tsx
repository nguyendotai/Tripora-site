"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useListMyConversationsQuery } from "@/features/conversation/api/conversation.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function timeLabel(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function ConversationList() {
  const { data, isLoading, isError } = useListMyConversationsQuery();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Tin nhắn</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trò chuyện trực tiếp với các đối tác bạn đã liên hệ.
        </p>

        <div className="mt-8 space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">Không tải được danh sách tin nhắn.</p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Bạn chưa có cuộc trò chuyện nào</p>
              <p className="text-sm text-muted-foreground">
                Nhấn &quot;Liên hệ đối tác&quot; ở trang chi tiết khách sạn/tour/hoạt động để bắt đầu.
              </p>
            </div>
          ) : (
            data.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:bg-accent/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {conversation.provider.name[0]?.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm ${
                        conversation.unreadCount > 0 ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {conversation.provider.name}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeLabel(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage?.content ?? "Chưa có tin nhắn"}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-medium text-destructive-foreground">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <ConversationList />
      </RequireAuth>
      <Footer />
    </>
  );
}

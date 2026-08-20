"use client";

import Link from "next/link";
import { PostCard } from "@/features/post/components/post-card";
import { useListMySavedPostsQuery } from "@/features/saved-post/api/saved-post.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function SavedPostsList() {
  const { data, isLoading, isError } = useListMySavedPostsQuery();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Bài viết đã lưu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Những bài viết cộng đồng bạn đã lưu lại để xem sau.
        </p>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">Không tải được danh sách đã lưu.</p>
          ) : !data || data.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="font-medium">Bạn chưa lưu bài viết nào</p>
              <p className="text-sm text-muted-foreground">
                Nhấn biểu tượng lưu trên 1 bài viết ở{" "}
                <Link href="/community" className="font-medium text-primary hover:underline">
                  Cộng đồng
                </Link>{" "}
                để lưu vào đây.
              </p>
            </div>
          ) : (
            data.map((item) => <PostCard key={item.id} post={item.post} />)
          )}
        </div>
      </div>
    </main>
  );
}

export default function SavedPostsPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <SavedPostsList />
      </RequireAuth>
      <Footer />
    </>
  );
}

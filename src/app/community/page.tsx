"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/post/components/post-card";
import { PostComposer } from "@/features/post/components/post-composer";
import { useListPostsQuery } from "@/features/post/api/post.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

const PAGE_SIZE = 12;

export default function CommunityPage() {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, isLoading, isError } = useListPostsQuery({ limit });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Cộng đồng du lịch</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nơi các Traveler Tripora chia sẻ hành trình và khoảnh khắc đáng nhớ.
          </p>

          <div className="mt-6">
            <PostComposer />
          </div>

          <div className="mt-8 space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : isError ? (
              <p className="text-sm text-destructive">
                Không tải được bảng tin cộng đồng. Vui lòng thử lại sau.
              </p>
            ) : !data || data.items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <p className="font-medium">Chưa có bài viết nào</p>
                <p className="text-sm text-muted-foreground">
                  Hãy là người đầu tiên chia sẻ hành trình của bạn!
                </p>
              </div>
            ) : (
              <>
                {data.items.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {data.pagination.hasNextPage && (
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
                    >
                      Xem thêm
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

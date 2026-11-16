import type { Post } from "@/lib/schemas";
import { PostCard } from "@/components/PostCard";

export function PostList({
  posts,
  emptyMessage = "Todavía no hay posts publicados.",
}: {
  posts: Post[];
  emptyMessage?: string;
}) {
  if (posts.length === 0) {
    return (
      <p className="font-body text-body text-text-secondary">{emptyMessage}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

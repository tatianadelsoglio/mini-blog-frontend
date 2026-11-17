import type { Post } from "@/lib/schemas";
import { PostCard } from "@/components/PostCard";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-xl gap-y-3xl md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

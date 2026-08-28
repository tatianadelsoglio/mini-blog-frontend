// app/page.tsx
interface Post {
  id: number;
  documentId: string;
  title: string;
  content: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts`);
  const json = await res.json();
  return json.data;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mini Blog</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border p-4 rounded">
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
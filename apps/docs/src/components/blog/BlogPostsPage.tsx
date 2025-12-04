import type { BlogPost } from "@/lib/source";
import { FaNewspaper } from "react-icons/fa";
import BlogPosts from "./BlogPosts";

interface BlogPageProps {
    posts: BlogPost[],
}
export default function BlogPostsPage({ posts }: BlogPageProps) {
    return <main className="flex flex-col gap-2 px-12 items-center">
        <div className="flex flex-col py-8 gap-8">
            <div className="p-8 border rounded-md w-full">
                <h1 className="flex items-center gap-4 text-4xl font-bold">
                    <FaNewspaper /> Blog
                </h1>
                <p className="text-xl text-muted-foreground">
                    Fique por dentro das novidades, atualizações e dicas sobre a CLI e a base de bots
                </p>
            </div>
            <div className="flex">
                <BlogPosts posts={posts} />
            </div>
        </div>
    </main>
}
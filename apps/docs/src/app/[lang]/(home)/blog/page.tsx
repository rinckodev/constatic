import { BlogPosts } from "@/components/features/blog/BlogPosts";
import { blog } from "@lib/source";
import path from "node:path";
import { FaNewspaper } from "react-icons/fa6";

export default function Page() {
    const posts = [...blog.getPages()]
        .sort(
            (a, b) =>
            new Date(b.data.date ?? path.basename(b.path, path.extname(b.path))).getTime() -
            new Date(a.data.date ?? path.basename(a.path, path.extname(a.path))).getTime(),
        );

    return <div className="container flex flex-col gap-2 px-2 py-4 items-center">
        <div className="flex flex-col gap-2 p-8 border rounded-md w-full">
            <h1 className="flex items-center gap-4 text-4xl font-bold">
                <FaNewspaper /> Blog
            </h1>
            <p className="text-xl text-muted-foreground">
                Fique por dentro das novidades, atualizações e dicas sobre a CLI e a base de bots
            </p>
        </div>
        <BlogPosts posts={posts}/>
    </div>
}
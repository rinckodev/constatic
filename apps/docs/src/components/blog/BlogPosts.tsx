import type { BlogPost } from "@/lib/source";
import Link from "next/link";
import { IoFlameSharp } from "react-icons/io5";
import BlogPostDate from "./BlogPostDate";
import { BlogTag } from "./BlogTag";
import { getPostDate } from "./date";

interface BlogPostItemProps {
    posts: BlogPost[],
}

export default function BlogPosts({ posts }: BlogPostItemProps) {
    const mostRecentPost = posts[0];
    return <div className="flex flex-col gap-2 w-fit">
        {posts.map(post => <Link
            key={post.path}
            href={post.url}
            className="flex flex-col gap-1 lg:w-4xl h-2xl border p-4 rounded-md
            hover:cursor-pointer hover:bg-white/5
            transition-all duration-500 ease-in-out
            "
        >
            <BlogPostDate date={getPostDate(post)} />
            <span className="flex gap-2 text-lg font-bold items-center">
                {post.data.title}
                {mostRecentPost.data.title === post.data.title &&
                    <p className="
                    bg-orange-500 text-orange-900 rounded-md text-xs px-2
                    flex items-center gap-1 h-4
                    ">
                        <IoFlameSharp /> Novo
                    </p>
                }
            </span>
            <p className="line-clamp-1">
                {post.data.description}
            </p>
            {
                post.data.tags && <div
                    className="flex flex-wrap gap-2"
                >
                    {post.data.tags.map(tag => <BlogTag key={tag} tag={tag} />)}
                </div>
            }
        </Link>)}
    </div>
}
import type { BlogPost } from "@/lib/source";
import Link from "next/link";
import { IoFlameSharp } from "react-icons/io5";
import { cn } from "fumadocs-ui/utils/cn";
import { BlogTag } from "./BlogTag";

interface BlogArticleProps {
    post: BlogPost,
    isMostRecent: boolean;
    index: number;
}
export function BlogArticle({ post, isMostRecent, index }: BlogArticleProps) {
    return <Link href={post.url} className="w-full">
        <article
            className={cn(
                `flex flex-col gap-2 p-4 w-full
                hover:cursor-pointer hover:bg-white/5
                transition-all duration-500 ease-in-out
                dark:text-neutral-300 dark:hover:text-white
                border-b border-border h-36 rounded-md
                motion-preset-slide-right-sm`,
                `motion-delay-[${index * 200}ms]`
            )}>
            <div className="flex justify-between items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                        {post.data.title}
                    </h2>
                    {isMostRecent && <p className="
                    bg-orange-500 text-orange-900 rounded-md text-xs px-2
                    flex items-center gap-1 motion-preset-oscillate motion-duration-700
                    "><IoFlameSharp/> Novo</p>} 
                </div>
                <time className="text-xs text-muted-foreground">
                    {new Date(post.data.date ?? post.path).toLocaleDateString()}
                </time>
            </div>
            {post.data.tags &&
                <div className="flex flex-wrap gap-2">
                    {post.data.tags.map(tag => <BlogTag key={tag} tag={tag} />)}
                </div>
            }
            <p className="h-1/2 overflow-hidden">{post.data.description}</p>
        </article>
    </Link>
}
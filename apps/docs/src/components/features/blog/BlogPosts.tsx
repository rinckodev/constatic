import { BlogPost } from "@/lib/source";
import { BlogArticle } from "./BlogArticle";
// import { cn } from "@/lib/cn";
// import { useState } from "react";
// import { BlogArticle } from "./BlogArticle";
// import { BlogTag, blogTags } from "./BlogTag";
// import { Input } from "@/components/ui/input";

interface BlogPostsProps {
    posts: BlogPost[]
}

export function BlogPosts({ posts: p }: BlogPostsProps) {

    const mostRecentPost = p[0];
    return <div className="flex flex-col-reverse md:flex-row gap-2 justify-between w-full">

        <div className="flex flex-col gap-2 w-full rounded-md">
            {p.map((post, index) => <BlogArticle 
                key={post.data.title} 
                post={post} 
                index={index}
                isMostRecent={mostRecentPost.data.title === post.data.title} 
            />)}
        </div>
    </div>
}
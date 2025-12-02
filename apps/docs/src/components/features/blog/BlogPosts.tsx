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
    // const [tags, setTags] = useState<string[]>([]);
    // const [search, setSearch] = useState<string>("");

    // function onSelectTag(tag: string) {
    //     setTags(prev =>
    //         prev.includes(tag)
    //             ? prev.filter(t => t !== tag)
    //             : [...prev, tag]
    //     );
    // }

    const mostRecentPost = p[0];

    // const posts = p.filter((post) => {
    //     const matchesTags =
    //         tags.length === 0 ||
    //         post.data.tags?.some((tag) => tags.includes(tag));

    //     const matchesSearch =
    //         search === "" ||
    //         post.data.title.toLowerCase().includes(search.toLowerCase()) ||
    //         post.data.description?.toLowerCase().includes(search.toLowerCase());

    //     return matchesTags && matchesSearch;
    // });
    return <div className="flex flex-col-reverse md:flex-row gap-2 justify-between w-full">

        <div className="flex flex-col gap-2 w-full rounded-md">
            {p.map((post, index) => <BlogArticle 
                key={post.data.title} 
                post={post} 
                index={index}
                isMostRecent={mostRecentPost.data.title === post.data.title} 
            />)}
        </div>

        {/* <div className="flex h-fit flex-col gap-2 p-4 md:w-2/4">
            <div className="flex flex-col gap-2">
                <h2>Pesquisar</h2>
                <Input
                    onChange={(event) => setSearch(event.target.value)}
                    className="bg-card w-full"
                    placeholder="Pesquise por título ou descrição"
                />
            </div>
            <div className="flex flex-col gap-2">
                <h2>Filtrar tags</h2>
                <div className="flex flex-wrap rounded-md bg-card/80 p-4 gap-2 text-sm">
                    {Object.entries(blogTags).map(([key, { border }]) =>
                        <button
                            onClick={() => onSelectTag(key)}
                            key={key} className="">
                            <BlogTag tag={key}
                                className={cn(
                                    "border", tags.includes(key) ? border : "border-transparent"
                                )} />
                        </button>
                    )}
                </div>
            </div>
        </div> */}

    </div>

    // return <div>
    //     {p.map((post, index) => <BlogArticle
    //         key={post.data.title} 
    //         post={post} 
    //         index={index}
    //         isMostRecent={true}
    //         // isMostRecent={mostRecentPost.data.title === post.data.title} 
    //     />)}
    // </div>
}
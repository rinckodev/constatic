import BlogPostsPage from "@/components/blog/BlogPostsPage";
import { getPostDate } from "@/components/blog/date";
import { blog } from "@lib/source";

export default function Page() {
    const posts = [...blog.getPages()]
        .sort((a, b) =>
            getPostDate(b).getTime() -
            getPostDate(a).getTime()
        );
    return <BlogPostsPage posts={posts} />
}

import { ChangelogPost } from "@/lib/source";
import { basename, extname } from "node:path";

export function getPostDate(post: ChangelogPost){
    return new Date(post.data.date 
        ?? basename(post.path, extname(post.path))
    );
}
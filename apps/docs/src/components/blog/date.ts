import { BlogPost } from "@/lib/source";
import { basename, extname } from "node:path";

export function getPostDate(post: BlogPost){
    return new Date(post.data.date 
        ?? basename(post.path, extname(post.path))
    );
}
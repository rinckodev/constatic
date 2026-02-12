import { Changelog, ChangelogItem } from "@/components/changelog/Changelog";
import DisplayDate from "@/components/utils/date";
import { changelog } from "@/lib/source";
import Link from "next/link";
import { MdOutlineUpdate } from "react-icons/md";

export default async function Page() {
    const posts = changelog.getPages()
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

    return <main className="flex justify-center gap-2 p-4">
        <div className="flex flex-col lg:w-1/2 gap-2">
            <div className="p-8 border rounded-md">
                <h1 className="flex items-center gap-4 text-4xl font-bold">
                    <MdOutlineUpdate /> Changelog
                </h1>
                <p className="text-xl text-muted-foreground">
                    Registro de alterações da organização constatic
                </p>
            </div>
            <Changelog>{posts.map(post => <ChangelogItem
                key={post.data.version}
            >
                <Link 
                    href={post.url}
                    className="flex flex-col min-h-26 max-h-26 pb-12 overflow-hidden group">
                    <div className="flex lg:gap-2 flex-col lg:flex-row">
                        <ScopeLabel
                            scope={post.data.scope}
                            version={post.data.version}
                        />
                        <span>
                            {<DisplayDate date={post.data.date} />}
                        </span>
                    </div>
                    <p>{post.data.description}</p>
                </Link>
            </ChangelogItem>)}</Changelog>
        </div>
    </main>
}

interface ScopeLabelProps {
    scope: "cli" | "base",
    version: string;
}
function ScopeLabel({ scope, version }: ScopeLabelProps) {

    const label = {
        cli: "constatic",
        base: "@constatic/base"
    }[scope];

    return <h2 className="text-2xl font-semibold flex 
            group-hover:text-fd-primary group-hover:underline"
            
    >
        <span className="flex gap-2 items-center">
            {label}@
        </span>
        <code className="border rounded-md px-1 bg-fd-muted">
            {version}
        </code>
    </h2>
}
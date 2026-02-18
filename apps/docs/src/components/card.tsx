import { cn } from "@/lib/cn";
import Link from "fumadocs-core/link";
import type { HTMLAttributes, ReactNode } from "react";

export function Cards(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("grid grid-cols-2 gap-4 @container", props.className)}
    >
      {props.children}
    </div>
  );
}

export type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;

  href?: string;
  external?: boolean;
};

export function Card({ icon, title, description, ...props }: CardProps) {
  const E = props.href ? Link : "div";

  return (
    <E
      {...props}
      data-card
      className={cn(
        "block rounded-lg border bg-fd-card p-4 text-fd-card-foreground shadow-md transition-colors @max-lg:col-span-full",
        props.href && "hover:bg-fd-accent/80",
        props.className,
      )}
    >
      
      <h3 className="flex gap-2 items-center-safe not-prose mb-1 text-sm font-medium">
      {icon ? (
        <div className="not-prose w-fit rounded-md border bg-fd-muted p-2 text-fd-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
      ) : null}
      {title}
      </h3>
      {description ? (
        <p className="my-0 text-sm text-fd-muted-foreground">{description}</p>
      ) : null}
      {props.children ? (
        <div className="text-sm text-fd-muted-foreground prose-no-margin">
          {props.children}
        </div>
      ) : null}
    </E>
  );
}

import type { ReactNode } from "react";

export function Changelog({ children }: { children: ReactNode }) {
  return <div className="constatic-changelog">{children}</div>;
}

export function ChangelogItem({ children }: { children: ReactNode }) {
  return <div className="constatic-changelog-item">{children}</div>;
}

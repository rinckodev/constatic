import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { i18n } from "./i18n";
import icons from "./icons";
import { createElement } from "react";
import { PiFireSimpleFill, PiMagicWandFill } from "react-icons/pi";
import { HiMiniSparkles } from "react-icons/hi2";

const record = [...docs.docs, ...docs.meta]
  .reduce((prev, curr) => ({
    ...prev,
    [curr.info.path]: curr
  }), {} as Record<string, any>)

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n,
  icon(key) {
    if (key && key in icons) {
      return createElement(icons[key]);
    }
  },
  pageTree: {
    transformers: [
      {
        folder(node, _, metaPath) {
          if (!metaPath) return node;

          const tag = record[metaPath]?.tag;

          if (tag && node.name) {
            const iconTag = <PiFireSimpleFill className="text-orange-500" />;

            node.name = (
              <span className="flex items-center gap-2" key={metaPath}>
                {node.name}
                {iconTag}
              </span>
            );
          }

          return node;
        },
        file(node, filePath) {
          if (!filePath) return node;

          const tag = record[filePath]?.tag;

          if (tag && node.name) {
            const iconTag = tag === "new"
              ? <HiMiniSparkles className="text-green-500" />
              : <PiMagicWandFill className="text-yellow-500" />

            node.name = (
              <span className="flex items-center gap-2" key={filePath}>
                {node.name}
                {iconTag}
              </span>
            );
          }

          return node;
        },
      }
    ]
  }
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}

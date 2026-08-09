import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineCollections, defineDocs } from 'fumadocs-mdx/macro';
import { createElement } from 'react';
import z from 'zod';
import { i18n } from './i18n';
import icons from './icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

const withTagSchema = {
  tag: z.string().optional()
}

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend(withTagSchema),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema.extend(withTagSchema),
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  i18n,
  icon(key) {
    if (key && key in icons) {
      return createElement(icons[key]);
    }
  },
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const changelogCollection = defineCollections({
  dir: "content/changelog",
  type: "doc",
  schema: pageSchema.extend({
    date: z.coerce.date().or(z.date()),
    version: z.string(),
    scope: z.literal(["cli", "base"]).default("cli")
  }),
});

export const changelog = loader({
  baseUrl: "/changelog",
  i18n,
  source: changelogCollection.toFumadocsSource()
});

export type ChangelogPost = NonNullable<ReturnType<typeof changelog.getPage>>;


export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

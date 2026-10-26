import { readFile, access } from 'node:fs/promises'
const base = process.env.PORTFOLIO_BASE || '/'
const origin = process.env.PORTFOLIO_ORIGIN || 'https://cocobolo111-png.github.io'
const source = await readFile('src/data/projects.ts', 'utf8')
const routes = ['', 'story', 'fun', ...[...source.matchAll(/caseStudyUrl: siteUrl\('(work\/[^']+)'\)/g)].map(match => match[1])]
for (const route of routes) {
  const html = await readFile(`dist/${route ? `${route}/` : ''}index.html`, 'utf8')
  if (!html.includes(`href="${origin}${base}${route}"`)) throw new Error(`Wrong canonical: ${route}`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) throw new Error('Missing description')
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) {
    if (!url.startsWith(base)) throw new Error(`Mixed deployment base: ${url}`)
    await access(`dist/${url.slice(base.length)}`)
  }
}
await access('dist/robots.txt')
await access('dist/sitemap.xml')
console.log(`Verified ${routes.length} static entries, entry assets and SEO metadata (${base})`)

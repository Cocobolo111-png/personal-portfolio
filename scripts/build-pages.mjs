// Emit direct-entry HTML files for the existing pathname routes on static hosts.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
const source = await readFile('src/data/projects.ts', 'utf8')
const html = await readFile('dist/index.html', 'utf8')
const base = process.env.PORTFOLIO_BASE || '/'
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('PORTFOLIO_BASE must start and end with /')
const origin = new URL(process.env.PORTFOLIO_ORIGIN || 'https://cocobolo111-png.github.io').origin
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const page = (route, title) => html
  .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
  .replace('</head>', `  <link rel="canonical" href="${origin}${base}${route}" />\n  </head>`)
const routes = [...source.matchAll(/caseStudyUrl: siteUrl\('(work\/[^']+)'\),\s*title: '([^']+)'/g)]
if (routes.length !== [...source.matchAll(/caseStudyUrl: siteUrl\(/g)].length) throw new Error('Case route extraction incomplete')
await writeFile('dist/index.html', page('', '何扬 — AI Product / Operations / Growth'))
for (const [, route, title] of routes) {
  await mkdir(`dist/${route}`, { recursive: true })
  await writeFile(`dist/${route}/index.html`, page(route, `${title} — 何扬作品集`))
}
await mkdir('dist/fun', { recursive: true })
await writeFile('dist/fun/index.html', page('fun', 'Fun — 何扬的创意实验室'))
await mkdir('dist/story', { recursive: true })
await writeFile('dist/story/index.html', page('story', 'Story — 何扬'))
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}${base}sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'story', 'fun', ...routes.map(match => match[1])].map(route => `<url><loc>${escape(`${origin}${base}${route}`)}</loc></url>`).join('')}</urlset>\n`)
console.log(`Static entries: ${routes.length} case routes + Story + Fun`)

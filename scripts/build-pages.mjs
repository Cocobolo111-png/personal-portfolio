// Emit direct-entry HTML files for the existing pathname routes on static hosts.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
const source = await readFile('src/data/projects.ts', 'utf8')
const html = await readFile('dist/index.html', 'utf8')
const routes = [...source.matchAll(/caseStudyUrl: siteUrl\('(work\/[^']+)'\)/g)].map(match => match[1])
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true })
  await writeFile(`dist/${route}/index.html`, html)
}
console.log(`Static entries: ${routes.length} case routes`)

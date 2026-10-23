import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const sha = process.env.GITHUB_SHA
if (!/^[a-f0-9]{40}$/.test(sha || '')) throw new Error('A full GITHUB_SHA is required')
await writeFile('dist/deployment.json', JSON.stringify({ commit: sha, builtAt: new Date().toISOString() }) + '\n')
const entries = []
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`
    if (entry.isSymbolicLink()) throw new Error(`Symlink forbidden: ${path}`)
    if (entry.isDirectory()) await walk(path)
    else {
      const relative = path.slice(5)
      if (relative === 'SHA256SUMS') continue
      if (/[\n\r\\]/.test(relative)) throw new Error('Unsafe manifest filename')
      entries.push(`${createHash('sha256').update(await readFile(path)).digest('hex')}  ${relative}`)
    }
  }
}
await walk('dist')
await writeFile('dist/SHA256SUMS', entries.sort().join('\n') + '\n')

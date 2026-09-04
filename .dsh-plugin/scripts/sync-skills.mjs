// Refresh the self-contained skills/ copies from the repo-root source of
// truth before packing (npm cannot include files outside the package dir).
// Run automatically via prepublishOnly; safe to run any time.
import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const source = join(root, '..', 'skills')
if (!existsSync(source)) throw new Error('skills source not found — run this from a repo checkout')
rmSync(join(root, 'skills'), { recursive: true, force: true })
cpSync(source, join(root, 'skills'), { recursive: true })
console.log('skills/ synced from ../skills')

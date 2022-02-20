import { readdir, readFile, writeFile, ensureDir, emptyDir, stat, copyFile } from 'fs-extra'
import { resolve, join } from 'path'
import { build } from 'vite'
import { parseMetadata } from './parse-metadata'
const toAbsolute = (...p:string[]) => resolve(__dirname, ...p)
const root_folder = toAbsolute('../')
const dist_folder = toAbsolute('../dist')

async function bootstrap() {
	await ensureDir(dist_folder)
	await emptyDir(dist_folder)

	let db = await parseMetadata()

	await build({
		root: root_folder,
		publicDir: 'dummy',
		build: {
			outDir: dist_folder,
			rollupOptions: {
				plugins: []
			}
		}
	})

	for (let submission of db.data) {
		const submission_folder = join(dist_folder, `./s/${submission.id}`)
		await ensureDir(submission_folder)
		await copyFile(join(root_folder, 'index.html'), join(submission_folder, 'index.html'))
	}
}

bootstrap()
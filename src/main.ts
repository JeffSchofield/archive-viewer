import { createApp as createVueApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { createArchiveService } from './services/archive'


export async function createApp() {
	const app = createVueApp(App)

	const router = createAppRouter()
	app.use(router)

	const archive_service = await createArchiveService()
	app.use(archive_service)

	return { app, router }
}
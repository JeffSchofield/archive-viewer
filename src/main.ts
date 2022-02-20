import { createApp as createVueApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { createArchiveService } from './services/archive'
import SvgIcon from './components/SvgIcon.vue'
import 'virtual:svg-icons-register'


export async function createApp() {
	const app = createVueApp(App)

	const router = createAppRouter()
	app.use(router)

	const archive_service = await createArchiveService()
	app.use(archive_service)

	app.component('SvgIcon', SvgIcon)

	return { app, router }
}
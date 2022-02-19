import { inject, Plugin } from 'vue'

const ServiceSymbol = Symbol('ArchiveService')

export interface ArchiveMetadata {
	id: string
	file_id: string
	featured_time?: number
	featured: number
	imgpath: string
	filepath: string
	soundeffects: string
	music: string
	year: number
	day: number
	month: number
	views: number
	time: number
	shortdesc: string
	desc: string
	score: number
	randid: string
	rating: string
	type: string
	size: number
	height: number
	width: number
	user_id: number
	username:string
	name:string
	fa_id:number
}

export interface ArchiveService {
	getAll():ArchiveMetadata[]
	getByID(id:string):ArchiveMetadata
	getAllByUserID(user_id:number):ArchiveMetadata[]
}

export function useArchiveService():ArchiveService {
	const service = inject<ArchiveService>(ServiceSymbol)
	if (!service) throw new Error('Unable to inject Archive Service')
	return service
}

export async function createArchiveService():Promise<ArchiveService&Plugin> {
	const database = await import('../../database.json')

	const api:ArchiveService = {
		getAll() {
			return database.data as ArchiveMetadata[]
		},
		getByID(id:string) {
			return database.data[database.indexes.id[id]] as ArchiveMetadata
		},
		getAllByUserID(user_id:number) {
			return (database.indexes.user_id[user_id] || []).map(index => database.data[index]) as ArchiveMetadata[]
		}
	}

	return {
		...api,
		install(app) {
			app.provide(ServiceSymbol, api)
		}
	}
}
const { sync } = require('fast-glob')
const { readFile, writeFile, stat } = require('fs-extra')
const { v4 } = require('uuid')
const unesc = require('lodash/unescape')

const db:{ indexes: { [key:string]:any }, collections: { [key:string]:any }, data:any[] } = {
	indexes: {
		id: {},
		file_id: {},
		user_id: {},
		featured: {},
		date: {}
	},
	collections: {
		usernames: {}
	},
	data: [],
}

async function bootstrap() {
	try {
		if (await stat('./database.json')) return console.log('Database exists, skipping parse...')
	} catch(e) {}
	const metadata_files = sync('./metadata/**.json')
	if (metadata_files.length == 0) {
		console.log('No metadata files found.')
		process.exit()
	}

	console.log(`Processing ${metadata_files.length} metadata files...`)
	let i = 0
	let errors = 0
	for(let file_name of metadata_files) {
		const json = await readFile(file_name, 'utf8')
		if (json) {
			const metadata = JSON.parse(json)
			const file_id = file_name.match(/\/([^\/]*)-metadata\.json$/)![1]
			const id = v4()

			const metadata_db_entry:{ [key:string]:any } = { id, file_id }
			let db_value:string|number
			for (let metadata_key of Object.keys(metadata)) {
				let metadata_value:string = metadata[metadata_key]
				if (metadata_key == 'id') metadata_key = 'fa_id'

				let string_match = metadata_value.match(/'((?:\\[\s\S]|[^'\\])*)'/)

				if (string_match) metadata_value = string_match[1]
				if (metadata_key == 'shortdesc' || metadata_key == 'desc') metadata_value = decodeString(metadata_value)

				let number_match = metadata_value.match(/^([0-9]*[.])?[0-9]*$/)
				if (number_match) db_value = parseFloat(number_match[0])
				else db_value = metadata_value

				metadata_db_entry[metadata_key] = db_value
			}



			const data_index = db.data.push(metadata_db_entry) - 1
			const { user_id, username, featured, year, month, day } = metadata_db_entry
			const date_index = `${year}${month}${day}`

			// Primary ID index
			db.indexes.id[id] = data_index

			// File ID index
			db.indexes.file_id[file_id] = data_index

			// User ID index
			if (!db.indexes.user_id[user_id]) db.indexes.user_id[user_id] = []
			db.indexes.user_id[user_id].push(data_index)

			// Featured index
			if (!db.indexes.featured[featured]) db.indexes.featured[featured] = []
			db.indexes.featured[featured].push(data_index)

			// Date index
			if (!db.indexes.date[date_index]) db.indexes.date[date_index] = []
			db.indexes.date[date_index].push(data_index)

			// Collect Usernames
			if (!db.collections.usernames[user_id]) db.collections.usernames[user_id] = []
			if(!db.collections.usernames[user_id].includes(username)) db.collections.usernames[user_id].push(username)


			i++
			updateLine(`Processed: ${i} records`)
		} else {
			errors++
		}
	}
	updateLine(`Finished processing ${i} records.\n`)
	if (errors) console.log(`Unable to parse ${errors} records.`)

	await writeFile('./database.json', JSON.stringify(db, null, '\t'))
}

function decodeString(string:string) {
	return unesc(string.replace(/([\\]+[r])/g, '').replace(/([\\]+[n])/g, '\n').replace(/&#039;/g, "'"))
}

function updateLine(text:string){
	process.stdout.cursorTo(0)
	process.stdout.write(text)
}

bootstrap()
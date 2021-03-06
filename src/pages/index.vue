<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { capitalizeFirstLetterAllWords } from '../utils'
	import { format, formatDistanceStrict } from 'date-fns/fp'
	import fuzzysort from 'fuzzysort'
	import TextInput from '../components/TextInput.vue'
	import SelectEnum from '../components/SelectEnum.vue'
	import Player from '../components/Player.vue'
	import { useArchiveService } from '../services/archive'
	import { useRoute } from 'vue-router'
	const { getByID, getAll, getAllByUserID } = useArchiveService()
	const route = useRoute()

	enum ArchiveFields {
		USERNAME = 'username',
		NAME = 'name',
		SHORTDESC = 'shortdesc',
		DESC = 'desc',
	}

	enum SortByFields {
		SCORE = 'score',
		VIEWS = 'views',
		TIME = 'time'
	}

	enum SortDirection {
		DESC = 'desc',
		ASC = 'asc'
	}

	const search_term = ref<string|undefined>()
	const search_field = ref(ArchiveFields.NAME)
	const sort_by = ref<SortByFields|undefined>(SortByFields.TIME)
	const sort_dir = ref<SortDirection>(SortDirection.ASC)
	const show_metadata = ref(false)

	const results = computed(() => {
		let type:'list'|'search' = 'list'
		let data:any[] = []
		if (search_term.value) {
			// if (search_field.value == ArchiveFields.USER_ID) data = getAllByUserID(parseInt(search_term.value))
			if ([ArchiveFields.USERNAME, ArchiveFields.NAME, ArchiveFields.DESC, ArchiveFields.SHORTDESC].includes(search_field.value)) {
				data = fuzzysort.go(search_term.value, getAll(), { threshold: 0, key: search_field.value })
				type = 'search'
			}
		} else {
			data = getAll()
		}

		if (sort_by.value) {
			data = [...data].sort((a,b) => {
				let a_value = a[sort_by.value!]
				let b_value = b[sort_by.value!]
				if (type == 'search') {
					a_value = a.obj[sort_by.value!]
					b_value = b.obj[sort_by.value!]
				}

				if (sort_dir.value == SortDirection.DESC) return b_value - a_value
				return a_value - b_value
			})
		}

		return { type, data }
	})

	const selected = computed(() => {
		if (route.params.id) {
			return getByID(route.params.id)
		}
	})
	const selected_date = computed(() => new Date((selected.value || { time: 0 }).time * 1000))
	const selected_featured_date = computed(() => {
		if (selected.value && selected.value.featured_time) return new Date(selected.value.featured_time * 1000)
	})

	const formatToNow = formatDistanceStrict(Date.now())
</script>

<template>
	<div class="h-full flex divide-x divide-neutral-350 dark:divide-neutral-950">
		<div class="h-full w-full flex-1 flex flex-col">
			<div class="flex items-center gap-1/2 p-1/2 border-b border-neutral-350 dark:border-neutral-950 bg-neutral-200 dark:bg-neutral-850">
				<div class="flex-1 text-2xl font-bold">FA Portal Submissions</div>
				<div class="flex items-center gap-1/2">
					<div>SEARCH</div>
					<TextInput v-model="search_term" class="w-10 border border-neutral-100" />
					<SelectEnum :enum="ArchiveFields" :format="(enum_type) => capitalizeFirstLetterAllWords(enum_type)" v-model="search_field" class="w-6" />
					<div class="pl-1">SORT</div>
					<SelectEnum :enum="SortByFields" :format="(enum_type) => capitalizeFirstLetterAllWords(enum_type)" v-model="sort_by" class="w-6" />
					<SelectEnum :enum="SortDirection" :format="(enum_type) => capitalizeFirstLetterAllWords(enum_type)" v-model="sort_dir" class="w-6" />
				</div>
			</div>
			<div class="flex-1 flex flex-col divide-y divide-neutral-300 dark:divide-neutral-950 overflow-y-auto">
				<RouterLink v-if="results.type == 'list'" v-for="metadata of results.data" :to="`/s/${metadata.id}`" class="flex items-center gap-1/2 p-1/2 text-left" :class="(selected && selected.id == metadata.id) ? 'bg-white dark:bg-neutral-600' : 'even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850 hover:bg-white dark:hover:bg-neutral-700'">
					<div class="flex flex-col space-y-1/8">
						<div><b>{{ metadata.name }}</b> <span class="text-neutral-300 dark:text-neutral-500">by</span> {{ metadata.username }}</div>
						<div class="text-xs leading-1/2 text-neutral-300 dark:text-neutral-500">{{ format("MMMM dd, yyyy", metadata.time * 1000) }}</div>
					</div>
					<div class="flex-1 flex items-center px-1/2">
						<div class="px-1/2 py-1/4 rounded-3/8 leading-3/4 bg-white/10">{{ metadata.shortdesc }}</div>
					</div>
					<div class="flex gap-1/2 p-1/2">
						<div class="flex justify-center items-center gap-1/2 min-w-2 px-1/2 py-1/4 rounded-full leading-3/4 bg-neutral-650">
							<SvgIcon class="h-1 fill-current" name="star" />
							<div>{{ metadata.score }}</div>
						</div>
						<div class="flex justify-center items-center gap-1/2 min-w-2 px-1/2 py-1/4 rounded-full leading-3/4 bg-neutral-650">
							<SvgIcon class="h-1 fill-current" name="eye" />
							<div>{{ metadata.views }}</div>
						</div>
					</div>
				</RouterLink>
				<RouterLink v-if="results.type == 'search'" v-for="result of results.data" :to="`/s/${result.obj.id}`" class="flex items-center gap-1/2 p-1/2 text-left" :class="(selected && selected.id == result.obj.id) ? 'bg-white dark:bg-neutral-600' : 'even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850 hover:bg-neutral-0'">
					<div class="flex flex-col space-y-1/8">
						<div><b>{{ result.obj.name }}</b> <span class="text-neutral-300 dark:text-neutral-500">by</span> {{ result.obj.username }}</div>
						<div class="text-xs leading-1/2 text-neutral-300 dark:text-neutral-500">{{ format("MMMM dd, yyyy", result.obj.time * 1000) }}</div>
					</div>
					<div class="flex-1 flex items-center px-1/2">
						<div class="px-1/2 py-1/4 rounded-3/8 leading-3/4 bg-white/10" v-if="search_field != ArchiveFields.DESC">{{ result.obj.shortdesc }}</div>
						<div class="px-1/2 py-1/4 rounded-3/8 leading-3/4 bg-white/10" v-else>{{ result.target }}</div>
					</div>
					<div class="flex gap-1/2 p-1/2">
						<div class="flex justify-center items-center gap-1/2 min-w-2 px-1/2 py-1/4 rounded-full leading-3/4 bg-neutral-650">
							<SvgIcon class="h-1 fill-current" name="star" />
							<div>{{ result.obj.score }}</div>
						</div>
						<div class="flex justify-center items-center gap-1/2 min-w-2 px-1/2 py-1/4 rounded-full leading-3/4 bg-neutral-650">
							<SvgIcon class="h-1 fill-current" name="eye" />
							<div>{{ result.obj.views }}</div>
						</div>
					</div>
				</RouterLink>
			</div>
		</div>
		<div v-if="selected" :key="selected.id" class="min-w-20 w-full flex flex-col" :style="`max-width: ${selected.width}px`">
			<div class="p-1/2 text-sm font-semibold bg-neutral-250 dark:bg-neutral-900">Submission Details</div>
			<div class="flex-1 bg-neutral-150 dark:bg-neutral-850 overflow-y-auto">
				<div class="flex items-center gap-1/2">
					<div class="flex-1 p-1/2 flex flex-col gap-1/4">
						<div class="text-2xl leading-1 font-bold break-all">{{ selected.name }}</div>
						<div class="leading-3/4 text-neutral-600">by <span class="font-semibold text-black dark:text-white">{{ selected.username }}</span></div>
					</div>
					<div class="p-1/2 text-4xl font-black bg-neutral-900">{{ selected.score }}</div>
				</div>
				<div class="p-1/2 bg-neutral-500 dark:bg-neutral-950">
					<Player :file_id="selected.file_id" :width="selected.width" :height="selected.height" />
				</div>
				<div class="flex flex-col gap-1/2 p-1/2">
					<div class="p-1/2 rounded-1/2 border border-neutral-300 dark:border-neutral-750 bg-neutral-250 dark:bg-neutral-800 whitespace-pre-wrap">
						{{ selected.desc }}
					</div>
					<div class="rounded-1/2 border border-neutral-300 dark:border-neutral-750 bg-neutral-250 dark:bg-neutral-800 whitespace-pre-wrap">
						<div class="p-1/2 leading-3/4 font-bold">Details</div>
						<dl>
							<div class="flex gap-1/2 p-1/2 even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850">
								<dt>Views</dt>
								<div class="flex-1 leader"></div>
								<dd class="col-span-2 font-semibold">{{ selected.views }}</dd>
							</div>
							<div v-if="selected.music && selected.music != '---'" class="flex gap-1/2 p-1/2 even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850">
								<dt>Music</dt>
								<div class="flex-1 leader"></div>
								<dd class="col-span-2 font-semibold">{{ selected.music }}</dd>
							</div>
							<div v-if="selected.soundeffects && selected.soundeffects != '---'" class="flex gap-1/2 p-1/2 even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850">
								<dt>Sound Effects</dt>
								<div class="flex-1 leader"></div>
								<dd class="col-span-2 font-semibold">{{ selected.soundeffects }}</dd>
							</div>
							<div class="flex gap-1/2 p-1/2 even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850">
								<dt>Upload Date</dt>
								<div class="flex-1 leader"></div>
								<dd class="col-span-2 font-semibold">{{ format("MMMM dd, yyyy", selected_date) }} ({{ formatToNow(selected_date) }} ago)</dd>
							</div>
							<div v-if="selected_featured_date" class="flex gap-1/2 p-1/2 even:bg-neutral-100 odd:bg-neutral-150 dark:even:bg-neutral-900 dark:odd:bg-neutral-850">
								<dt>Featured Date</dt>
								<div class="flex-1 leader"></div>
								<dd class="col-span-2 font-semibold">{{ format("MMMM dd, yyyy", selected_featured_date) }} ({{ formatToNow(selected_featured_date) }} ago)</dd>
							</div>
						</dl>
						<div class="h-1"></div>
					</div>
					<div class="flex flex-col rounded-1/2 border border-neutral-300 dark:border-neutral-750">
						<button @click="show_metadata = !show_metadata" class="block w-full p-1/2 text-left bg-neutral-250 dark:bg-neutral-800" :class="{'rounded-t-1/2': show_metadata, 'rounded-1/2': !show_metadata}">Show metadata</button>
						<pre v-if="show_metadata" class="p-1/2 rounded-b-1/2 bg-neutral-250 dark:bg-neutral-900 whitespace-pre-wrap">{{ selected }}</pre>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
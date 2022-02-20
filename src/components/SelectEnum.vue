<script setup lang="ts">
	import { computed, nextTick, ref, watch } from 'vue';
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
	import { getKeyByValue } from '../utils'
	// import SvgIcon from './SvgIcon.vue'

	const props = defineProps<{
		modelValue?:number|string
		enum:{[key:string]:any}
		format?:(enum_value:any)=>string
	}>()

	const emit = defineEmits(['update:modelValue'])
	const formatValue = (enum_value:any) => props.format ? props.format(enum_value) : props.enum[enum_value]

	const enum_filtered = computed(() => Object.fromEntries(Object.entries(props.enum).filter(([_, id]) => {
		return isNaN(id.toString().charAt(0))
	})))
	const	selected = ref<[any|undefined, number|string|undefined]>([props.modelValue, getKeyByValue(enum_filtered.value, props.modelValue)])

	const flush = 'sync'
	let syncing = false
	watch(() => props.modelValue, (new_value) => {
		syncing = true // Mark as syncing so when we set the internal value it doesn't also emit again
		selected.value = [new_value, getKeyByValue(enum_filtered.value, new_value)]
		nextTick(() => syncing = false) // Mark as not syncing on the next tick; since flush is 'sync' both watches will be processed at once; after that we need not be marked as syncing
	}, { flush, immediate: true })
	watch(selected, ([value, _]) => {
		if (syncing) syncing = false
		else emit('update:modelValue', value)
	}, { flush, immediate: false })
</script>

<template>
  <Listbox as="div" v-model="selected" class="relative flex not-prose" v-slot="{ open }">
    <ListboxButton class="flex-1 flex items-center rounded-3/8 px-1/2 py-1/4 text-left text-black dark:text-white border border-neutral-200 dark:border-0 bg-neutral-50 dark:bg-neutral-750" :class="{ 'rounded-b-none border-b-0': open }">
			<div class="flex-1 leading-1">{{ selected[0] ? formatValue(selected[0]) : 'Select...' }}</div>
			<SvgIcon name="chevron-down" class="h-3/4 fill-current" :class="{'rotate-180':open}" />
		</ListboxButton>
    <ListboxOptions class="absolute top-100% inset-x-0 p-0 z-popover max-h-14 overflow-y-auto border border-neutral-200 dark:border-0 dark:border-t border-t-neutral-300 dark:border-t-neutral-850 rounded-b-3/8 shadow-sm">
			<ListboxOption
				v-for="(value, id) in enum_filtered"
				:key="id"
				:value="[value, id]"
				class="px-1/2 py-1/4 cursor-pointer bg-neutral-50 can-hover:hover:bg-neutral-100 dark:bg-neutral-775 dark:can-hover:hover:bg-neutral-700"
			>
				{{ formatValue(value) }}
			</ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>
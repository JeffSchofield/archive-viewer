<script setup lang="ts">
	import { ref, onMounted } from 'vue'

	const props = defineProps<{
		file_id:string,
		width:number,
		height:number
	}>()

	const player_container = ref<HTMLElement>()

	onMounted(() => {
		if (player_container.value) {
			const ruffle = window.RufflePlayer.newest()
			const player = ruffle.createPlayer()
			// player.style.width = `${props.width}px`
			// player.style.height = `${props.height}px`
			player.style.width = `100%`
			player.style.height = `100%`

			player_container.value.appendChild(player)
			player.load(`/swf/${props.file_id}.swf`)
		}
	})
</script>

<template>
	<div ref="player_container" :style="`aspect-ratio: 1/${height/width};`"></div>
</template>
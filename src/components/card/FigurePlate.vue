<template>
	<div>
		<v-card>
			<v-card-text>{{ title }}</v-card-text>
			<v-card-title class="text-right justify-end">{{ figure }}</v-card-title>
			<v-card-actions v-if="hasActionsSlot">
				<slot name="actions"></slot>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";

	export default Vue.extend({
		name: "FigurePlate",

		props: {
			title: {
				type: String,
				required: true,
			},

			figure: {
				type: [String, Number],
				required: true,
			},

			icon: String,
			backgroundColour: String
		},

		computed: {
			hasActionsSlot(): boolean {
				return !!this.$slots.actions;
			}
		}
	});
</script>

<style scoped>

</style>
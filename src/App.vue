<template>
	<v-app>
		<router-view></router-view>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { EventBus } from "@/event-bus";
import ConfigurationService from "@/services/config/ConfigurationService.ts";

export default Vue.extend({
	name: 'App',
	created() {
		this.$vuetify.theme.dark = true;
		this.$store.commit("config/update", ConfigurationService.load());

		EventBus.$on("logout", () => {
			this.$router.push({
				name: "Login"
			});
		})
	}
});
</script>

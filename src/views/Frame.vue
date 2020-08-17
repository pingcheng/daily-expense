<template>
	<div>
		<v-navigation-drawer v-model="$store.state.config.showSidebar" app clipped>
			<v-list dense>
				<v-list-item link to="/">
					<v-list-item-action>
						<v-icon>mdi-view-dashboard</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item link to="/expense/add">
					<v-list-item-action>
						<v-icon>mdi-plus-thick</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>Add an expense</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app clipped-left>
			<v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
			<v-toolbar-title>Daily Expense</v-toolbar-title>

			<v-spacer></v-spacer>

			<top-bar-user-menu v-if="$store.state.my.id > 0"></top-bar-user-menu>

		</v-app-bar>

		<v-main>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-main>

		<v-dialog v-model="loadMyInfoDialog" persistent width="300">
			<v-card>
				<v-card-text>
					<span>Loading my information...</span>
					<v-progress-linear indeterminate></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
	import MyService from "@/services/my/MyService";
	import TopBarUserMenu from "@/components/topbar/TopBarUserMenu.vue";
	import Vue from "vue";
	import User from "@/models/users/User.ts";
	import ConfigurationService from "@/services/config/ConfigurationService.ts";
	import { Configuration } from "@/base/config/Configuration.ts";

	export default Vue.extend({
		name: "Frame",
		components: {TopBarUserMenu},
		data() {
			return {
				loadMyInfoDialog: false,
			}
		},

		methods: {
			toggleSidebar() {
				const config = this.$store.state.config;
				config.showSidebar = !config.showSidebar;
				this.$store.commit("config/update", config);
				ConfigurationService.persist(new Configuration(config));
			}
		},

		async created() {
			this.loadMyInfoDialog = true;

			const user = await MyService.getProfile();
			if (user instanceof User) {
				this.$store.commit('my/update', user);
			}

			this.loadMyInfoDialog = false;
		}
	});
</script>

<style scoped>

</style>
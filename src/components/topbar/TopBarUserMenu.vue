<template>
	<div>
		<v-menu bottom offset-y>
			<template v-slot:activator="{ on, attrs }">
					<span v-bind="attrs" v-on="on">
						<v-avatar size="32" class="mr-2">
							<img :src="$store.state.profile.avatar" alt="avatar">
						</v-avatar>
						<span>{{ $store.state.profile.name }}</span>
					</span>
			</template>

			<v-list>
				<v-list-item to="/my/password">
					<v-list-item-title>Update password</v-list-item-title>
				</v-list-item>
				<v-list-item to="/my/profile">
					<v-list-item-title>My profile</v-list-item-title>
				</v-list-item>
				<v-list-item @click="logout">
					<v-list-item-title>Logout</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<v-dialog v-model="logoutDialog" persistent width="300">
			<v-card>
				<v-card-text>
					<span>Logging out, please wait</span>
					<v-progress-linear indeterminate></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
	import { AuthService } from "@/services/auth/AuthService";
	import { EventBus } from "@/event-bus";
	import Vue from "vue";

	export default Vue.extend({
		name: "TopBarUserMenu",

		data() {
			return {
				logoutDialog: false,
			}
		},

		methods: {
			async logout() {
				this.logoutDialog = true;
				await AuthService.logout();
				EventBus.$emit("logout");
				this.logoutDialog = false;
			}
		}
	});
</script>

<style scoped>

</style>
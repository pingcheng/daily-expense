<template>
	<v-container>
		<v-card class="mb-2">
			<v-card-title>Basic Information</v-card-title>

			<v-form ref="form">
				<v-card-text>
					<v-text-field
						label="Email"
						v-model="user.email"
						disabled
					></v-text-field>

					<v-text-field
						label="Name"
						v-model="user.name"
						:disabled="inputDisable"
						:rules="[rule.required, rule.min7]"
						:error-messages="errorMessages.name"
					></v-text-field>
				</v-card-text>
			</v-form>
		</v-card>


		<v-btn color="primary" @click="save" :loading="saving">Save</v-btn>

		<v-dialog v-model="dialog.loadingMyInfo" persistent width="300">
			<v-card>
				<v-card-text>
					<span>Loading my information...</span>
					<v-progress-linear indeterminate></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script lang="ts">
	import Vue from "vue";
	import MyService from "@/services/my/MyService.ts";
	import User, { UserDTO } from "@/models/users/User.ts";
	import Rules from "@/helpers/validations/Rules.ts";
	import { applyErrorMessages, clearErrorMessages } from "@/helpers/validations/Validation.ts";
	import { validateForm, VForm } from "@/plugins/vuetify.ts";
	import FormErrorResponse from "@/base/api/errors/FormErrorResponse.ts";

	export default Vue.extend({
		name: "UpdateProfile",

		data() {
			return {
				dialog: {
					loadingMyInfo: false,
				},
				saving: false,

				rule: Rules,
				errorMessages: {
					name: []
				},

				user: new User(new UserDTO()),
			}
		},

		computed: {
			inputDisable(): boolean {
				return this.user.id === 0 || this.dialog.loadingMyInfo || this.saving;
			}
		},

		methods: {
			async save() {
				clearErrorMessages(this.errorMessages);
				if (!validateForm(this.$refs.form as VForm)) {
					return;
				}

				this.saving = true;

				const response = await MyService.updateProfile(this.user);

				if (response instanceof FormErrorResponse) {
					applyErrorMessages(this.errorMessages, response.getErrors());
				} else if (response) {
					await this.loadMyProfile();
				} else {
					alert("Failed to update... please try again later");
				}

				this.saving = false;
			},

			async loadMyProfile() {
				this.dialog.loadingMyInfo = true;

				const user = await MyService.getMyInfo();
				if (user instanceof User) {
					this.user = user;
					this.$store.commit('my/update', this.user);
				}

				this.dialog.loadingMyInfo = false;
			}
		},

		async mounted() {
			await this.loadMyProfile();
		}
	});
</script>

<style scoped>

</style>
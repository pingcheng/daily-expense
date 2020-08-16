<template>
	<v-container class="fill-height">
		<v-card min-width="350" max-width="600" class="mx-auto">
			<v-card-title>Update password</v-card-title>

			<v-card-text>
				<v-form ref="form">
					<v-text-field
						label="Current password"
						v-model="currentPassword"
						type="password"
						autofocus
						:rules="[rule.required, rule.min7]"
						:disabled="inputDisabled"
						:error-messages="errorMessage.currentPassword"
					></v-text-field>

					<v-text-field
						label="New password"
						v-model="newPassword"
						type="password"
						autofocus
						:rules="[rule.required, rule.min7]"
						:disabled="inputDisabled"
						:error-messages="errorMessage.newPassword"
					></v-text-field>

					<v-text-field
						label="Confirm new password"
						v-model="newPasswordConfirm"
						type="password"
						autofocus
						:rules="[rule.required, rule.min7, passwordConfirmationRule]"
						:disabled="inputDisabled"
					></v-text-field>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-btn color="primary" @click.stop="updatePassword" :loading="inProgress">Update</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script lang="ts">
	import Rules from "@/helpers/validations/Rules";
	import { applyErrorMessages, clearErrorMessages } from "@/helpers/validations/Validation";
	import MyService from "@/services/my/MyService";
	import FormErrorResponse from "@/base/api/errors/FormErrorResponse";
	import Vue from "vue";
	import { VForm } from "@/plugins/vuetify.ts";

	export default Vue.extend({
		name: "UpdatePassword",

		data() {
			return {
				inProgress: false,

				currentPassword: '',
				newPassword: '',
				newPasswordConfirm: '',

				errorMessage: {
					currentPassword: [],
					newPassword: [],
				},

				rule: Rules
			}
		},

		computed: {
			inputDisabled(): boolean {
				return this.inProgress;
			},

			passwordConfirmationRule() {
				return () => (this.newPassword === this.newPasswordConfirm) || 'Password does not match.'
			},

			form(): VForm {
				return this.$refs.form as VForm;
			}
		},

		methods: {
			async updatePassword() {
				clearErrorMessages(this.errorMessage);
				if (!this.form.validate()) {
					return;
				}

				this.inProgress = true;

				const response = await MyService.updatePassword(this.currentPassword, this.newPassword);
				if (response instanceof FormErrorResponse) {
					applyErrorMessages(this.errorMessage, response.getErrors());
				} else if (response) {
					alert('Updated!');
					this.currentPassword = '';
					this.newPassword = '';
					this.newPasswordConfirm = '';
				} else {
					alert('Something wrong... please try again later');
				}

				this.inProgress = false;
			},
		}
	});
</script>

<style scoped>

</style>
<template>
	<v-container class="fill-height">
		<v-card width="400" class="mx-auto">
			<v-card-title>Login</v-card-title>

			<v-card-text>
				<v-form ref="form" v-model="formValid">
					<v-text-field
						label="Email"
						v-model="email"
						type="email"
						autofocus
						:rules="[rules.required, rules.email]"
						:disabled="inProgress === true"
						:error-messages="errorMessage.email"
					></v-text-field>

					<v-text-field
						label="Password"
						v-model="password"
						type="password"
						:rules="[rules.required]"
						:disabled="inProgress === true"
						:error-messages="errorMessage.password"
					></v-text-field>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-btn :loading="inProgress" @click="login" color="primary">Login</v-btn>
				<v-btn to="/register">Register</v-btn>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script>
	import { LoginCredential } from "@/models/auth/LoginCredential";
	import { AuthService } from "@/services/auth/AuthService";
	import Rules from "@/helpers/validations/Rules";
	import FormErrorResponse from "@/base/api/errors/FormErrorResponse";
	import { applyErrorMessages, clearErrorMessages } from "@/helpers/validations/Validation";

	export default {
		name: "Login",

		data() {
			return {
				email: '',
				password: '',

				formValid: false,
				inProgress: false,

				rules: Rules,
				errorMessage: {
					email: [],
					password: [],
				}
			}
		},

		methods: {
			async login() {
				clearErrorMessages(this.errorMessage);
				if (!this.$refs.form.validate()) {
					return;
				}

				const credential = LoginCredential.with(this.email, this.password);
				const response = await AuthService.login(credential);

				if (response instanceof FormErrorResponse) {
					applyErrorMessages(this.errorMessage, response.getErrors());
				} else if (response) {
					await this.$router.push({
						path: "/"
					})
				} else {
					alert("Unknown error.");
				}
			}
		}
	}
</script>

<style scoped>

</style>
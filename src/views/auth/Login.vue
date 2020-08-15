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
						:rules="[rules.required, rules.email]"
						autofocus
						:disabled="inProgress === true"
					></v-text-field>

					<v-text-field
						label="Password"
						v-model="password"
						type="password"
						:rules="[rules.required]"
						:disabled="inProgress === true"
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

	export default {
		name: "Login",

		data() {
			return {
				email: '',
				password: '',

				formValid: false,
				inProgress: false,

				rules: Rules
			}
		},

		methods: {
			async login() {
				const valid = this.$refs.form.validate()

				if (!valid) {
					return;
				}

				const credential = LoginCredential.with(this.email, this.password);
				const token = await AuthService.login(credential);

				if (token) {
					await this.$router.push({
						path: "/"
					})
				}
			}
		}
	}
</script>

<style scoped>

</style>
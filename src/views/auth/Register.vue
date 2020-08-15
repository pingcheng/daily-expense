<template>
	<v-container class="fill-height">
		<v-card width="400" class="mx-auto">
			<v-card-title>Register</v-card-title>

			<v-card-text>
				<v-form ref="form" v-model="formValid">
					<v-text-field
						label="Email"
						v-model="email"
						type="email"
						autofocus
						:rules="[rules.required, rules.email]"
						:disabled="inputDisabled"
						:error-messages="errorMessage.email"
					></v-text-field>

					<v-text-field
						label="Name"
						v-model="name"
						type="text"
						:rules="[rules.required]"
						:disabled="inputDisabled"
						:error-messages="errorMessage.name"
					></v-text-field>

					<v-text-field
						label="Password"
						v-model="password"
						type="password"
						:rules="[rules.required, rules.min7]"
						:disabled="inputDisabled"
						:error-messages="errorMessage.password"
					></v-text-field>

					<v-text-field
						label="Confirm password"
						v-model="passwordConfirm"
						type="password"
						:rules="[rules.required, passwordConfirmationRule, rules.min7]"
						:disabled="inputDisabled"
					></v-text-field>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-btn color="primary" @click.stop="register" :loading="inProgress">Register</v-btn>
				<v-btn to="/">Back</v-btn>
			</v-card-actions>
		</v-card>

		<v-dialog v-model="registerSuccessDialog" max-width="300">
			<v-card>
				<v-card-title>Registered successfully!</v-card-title>
				<v-card-text>You can go back and login with your newly registered account now!</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" to="/">Go back</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
	import Rules from "@/helpers/validations/Rules";
	import { AuthService } from "@/services/auth/AuthService";
	import RegisterPayload from "@/models/auth/RegisterPayload";
	import FormErrorResponse from "@/base/api/errors/FormErrorResponse";

	export default {
		name: "Register",

		data() {
			return {
				formValid: false,
				inProgress: false,

				email: '',
				name: '',
				password: '',
				passwordConfirm: '',

				rules: Rules,
				errorMessage: {
					email: [],
					name: [],
					password: [],
				},

				registerSuccessDialog: false
			}
		},

		computed: {
			inputDisabled() {
				return this.inProgress === true;
			},

			passwordConfirmationRule() {
				return () => (this.password === this.passwordConfirm) || 'Password does not match.'
			}
		},

		methods: {
			async register() {
				this.clearFormMessage();
				if (!this.$refs.form.validate()) {
					return;
				}

				this.inProgress = true;
				const response = await AuthService.register(new RegisterPayload(this.email, this.name, this.password));

				if (response instanceof FormErrorResponse) {
					response.getErrorKeys().forEach((key) => {
						if (Object.prototype.hasOwnProperty.call(this.errorMessage, key)) {
							this.errorMessage[key] = response.getError(key);
						}
					});
				} else if (response === true) {
					this.registerSuccessDialog = true;
				} else {
					alert('Something wrong... please try again later');
				}

				this.inProgress = false;
			},

			clearFormMessage() {
				for (const key in this.errorMessage) {
					this.errorMessage[key] = [];
				}
			}
		}
	}
</script>

<style scoped>

</style>
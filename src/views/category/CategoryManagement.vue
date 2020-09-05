<template>

	<div>
		<!-- Main container -->
		<v-container>
			<v-row no-gutters>
				<v-col>
					<h1>Category Management</h1>
				</v-col>
			</v-row>

			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span class="pr-4">Main Category</span>
							<v-btn color="primary" small @click="openCreateCategoryDialog"><v-icon small>mdi-plus</v-icon> Add</v-btn>
						</v-card-title>
						<v-card-text>
							<v-list rounded>
								<v-list-item-group v-model="selectedCategory" color="primary">
									<v-list-item v-for="(category, index) in categories.items" :key="index" @click="loadSubCategories(category.id)">
										<v-list-item-icon>
											<v-icon color="red" v-if="category.type === categoryType.EXPENSE">mdi-minus</v-icon>
											<v-icon color="green" v-if="category.type === categoryType.INCOME">mdi-plus</v-icon>
										</v-list-item-icon>
										<v-list-item-content>
											<v-list-item-title v-text="category.name"></v-list-item-title>
										</v-list-item-content>
										<v-list-item-action>
											<div class="flex">
												<v-btn icon color="blue" @click.stop=""><v-icon small>mdi-lead-pencil</v-icon></v-btn>
												<v-btn icon color="red" @click.stop="deletionConfirm(category)"><v-icon small>mdi-delete</v-icon></v-btn>
											</div>
										</v-list-item-action>
									</v-list-item>
								</v-list-item-group>
							</v-list>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col>
					<v-card>
						<v-card-title>
							<span class="pr-4">Sub-category</span>
							<v-btn color="primary" small v-if="selectedCategory !== null"><v-icon small>mdi-plus</v-icon> Add</v-btn>
						</v-card-title>
						<v-card-text v-if="selectedCategory === null">
							Please choose a main category.
						</v-card-text>
						<v-card-text v-else>
							<v-list rounded v-if="subCategories.items && subCategories.items.length > 0">
								<v-list-item-group v-model="selectedSubCategory" color="primary">
									<v-list-item v-for="(subCategory, index) in subCategories.items" :key="index">
										<v-list-item-content>
											<v-list-item-title v-text="subCategory.name"></v-list-item-title>
										</v-list-item-content>
										<v-list-item-action>
											<div class="flex">
												<v-btn icon color="blue" @click.stop=""><v-icon small>mdi-lead-pencil</v-icon></v-btn>
												<v-btn icon color="red" @click.stop="deletionConfirm(subCategory)"><v-icon small>mdi-delete</v-icon></v-btn>
											</div>
										</v-list-item-action>
									</v-list-item>
								</v-list-item-group>
							</v-list>

							<div v-else>No sub-categories found, please add one.</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>

		<v-dialog v-model="displayDeleteModule" max-width="300">
			<v-card>
				<v-card-title>Confirm</v-card-title>
				<v-card-text>Are you confirm to delete this category, this action is irreversible!</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text @click="closeDeletionConfirm" :disabled="deleteDialog.loading">Cancel</v-btn>
					<v-btn color="red" text :disabled="deleteDialog.loading" @click="deleteCategoryController">Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="createCategoryDialog.display" max-width="400" :persistent="true">
			<v-card>
				<v-card-title>Add Category</v-card-title>
				<v-card-text>
					<v-form ref="createCategoryForm">
						<v-text-field
							label="Name"
							v-model="createCategoryDialog.name"
							type="string"
							autofocus
							:rules="[rules.required]"
							:disabled="createCategoryDialog.loading"
							:error-messages="createCategoryDialog.errorMessage.name"
						></v-text-field>

						<v-radio-group
							label="Type"
							v-model="createCategoryDialog.type"
							:error-messages="createCategoryDialog.errorMessage.type"
							:mandatory="true"
							:disabled="createCategoryDialog.loading"
							row
						>
							<v-radio label="Expense" :value="categoryType.EXPENSE"></v-radio>
							<v-radio label="Income" :value="categoryType.INCOME"></v-radio>
						</v-radio-group>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer>
						<v-btn text :disabled="createCategoryDialog.loading" @click="closeCreateCategoryDialog">Cancel</v-btn>
						<v-btn text color="primary" :disabled="createCategoryDialog.loading" @click="createCategory">Add</v-btn>
					</v-spacer>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import RecordCategoryService from "@/services/records/RecordCategoryService";
import RecordCategory, { RecordCategoryDto } from "../../models/records/RecordCategory";
import RecordSubCategory from "../../models/records/RecordSubCategory";
import PagedItems from "@/helpers/PagedItems";
import { RecordCategoryType } from "@/models/records/RecordEnums";
import GeneralErrorResponse from "@/base/api/errors/GeneralErrorResponse";
import Rules from "@/helpers/validations/Rules";
import FormErrorResponse from "@/base/api/errors/FormErrorResponse";
import { VForm } from "@/plugins/vuetify";
import { applyErrorMessages, clearErrorMessages } from "@/helpers/validations/Validation";

export default Vue.extend({
		name: "CategoryManagement",

		data() {
			return {
				categoryType: RecordCategoryType,

				categories: {} as PagedItems<RecordCategory>,
				subCategories: {} as PagedItems<RecordSubCategory>,

				selectedCategory: null,
				selectedSubCategory: null,

				rules: Rules,

				deleteDialog: {
					categoryInstance: null,
					loading: false,
				},

				createCategoryDialog: {
					display: false,
					loading: false,
					name: "",
					type: RecordCategoryType.EXPENSE,
					errorMessage: {
						name: [],
						type: [],
					}
				}
			}
		},

		computed: {
			displayDeleteModule(): boolean {
				return this.deleteDialog.categoryInstance !== null;
			},

			selectedCategoryInstance(): RecordCategory|null {

				if (this.selectedCategory === null) {
					return null;
				}

				return this.categories.items[this.selectedCategory];
			},

			createCategoryForm(): VForm {
				return this.$refs.createCategoryForm as VForm;
			}
		},

		methods: {
			async loadCategories() {
				const response = await RecordCategoryService.getCategories();
				if (response) {
					this.categories = response;
					this.selectedCategory = null;
				} else {
					alert('Failed to load category data');
				}
			},

			async loadSubCategories(categoryId: number) {
				const response = await RecordCategoryService.getSubCategories(categoryId);
				if (response) {
					this.subCategories = response;
				} else {
					alert('Failed to load sub-category data');
				}
			},

			deletionConfirm(category: RecordCategory|RecordSubCategory) {
				this.deleteDialog.categoryInstance = category;
			},

			closeDeletionConfirm() {
				this.deleteDialog.categoryInstance = null;
			},

			async deleteCategoryController() {
				const instance = this.deleteDialog.categoryInstance;
				if (typeof instance !== "object") {
					return;
				}

				switch (instance.constructor.name) {
					case RecordSubCategory.name: await this.deleteSubCategory(instance); return;
					case RecordCategory.name: await this.deleteCategory(instance); return;
					default: alert("Not support yet"); return;
				}
			},

			async deleteCategory(category: RecordCategory) {
				this.deleteDialog.loading = true;
				const response = await RecordCategoryService.deleteCategory(category.id);
				this.deleteDialog.loading = false;
				this.closeDeletionConfirm();

				if (response instanceof GeneralErrorResponse) {
					alert(response.getErrorMessage());
					return;
				}

				await this.loadCategories();
			},

			async deleteSubCategory(subCategory: RecordSubCategory) {
				this.deleteDialog.loading = true;
				const response = await RecordCategoryService.deleteSubCategory(subCategory.id);
				this.deleteDialog.loading = false;
				this.closeDeletionConfirm();

				if (response instanceof GeneralErrorResponse) {
					alert(response.getErrorMessage());
					return;
				}

				if (this.selectedCategoryInstance) {
					await this.loadSubCategories(this.selectedCategoryInstance.id);
				}
			},

			closeCreateCategoryDialog() {
				this.createCategoryDialog.display = false;
				this.createCategoryDialog.loading = false;
				this.createCategoryDialog.name = "";
				this.createCategoryDialog.type = RecordCategoryType.EXPENSE;
			},

			openCreateCategoryDialog() {
				this.closeCreateCategoryDialog();
				this.createCategoryDialog.display = true;
			},

			async createCategory() {
				clearErrorMessages(this.createCategoryDialog.errorMessage);
				if (!this.createCategoryForm.validate()) {
					return;
				}

				const dto = new RecordCategoryDto();
				dto.name = this.createCategoryDialog.name;
				dto.type = this.createCategoryDialog.type;

				this.createCategoryDialog.loading = true;
				const response = await RecordCategoryService.createCategory(dto);
				this.createCategoryDialog.loading = false;

				if (response instanceof FormErrorResponse) {
					applyErrorMessages(this.createCategoryDialog.errorMessage, response.getErrors());
				} else if (response instanceof GeneralErrorResponse) {
					alert(response.getErrorMessage());
				} else {
					await this.loadCategories();
					this.closeCreateCategoryDialog();
				}
			}
		},

		async mounted() {
			await this.loadCategories();
		}
	});
</script>

<style scoped>

</style>
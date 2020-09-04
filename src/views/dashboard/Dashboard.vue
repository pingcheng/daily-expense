<template>
	<div>
		<v-container>
			<v-row no-gutters>
				<v-col>
					<h1>{{ headingDate }}</h1>
				</v-col>
			</v-row>

			<v-row>
				<v-col cols="12" sm="4">
					<figure-plate title="Expense" figure="$1,990.00">
						<template slot="actions">
							<v-btn small color="red">Add expense</v-btn>
						</template>
					</figure-plate>
				</v-col>
				<v-col cols="12" sm="4">
					<figure-plate title="Income" figure="$1,990.00">
						<template slot="actions">
							<v-btn small color="green">Add income</v-btn>
						</template>
					</figure-plate>
				</v-col>
				<v-col cols="12" sm="4">
					<figure-plate title="Balance" figure="$0.00">
						<template slot="actions">
							<v-btn small color="red">Add expense</v-btn>
							<v-btn small color="green">Add income</v-btn>
						</template>
					</figure-plate>
				</v-col>
			</v-row>

			<v-row>
				<v-col>
					<v-card>
						<v-card-title>Records</v-card-title>
						<v-card-text>
							<v-data-table
								:headers="records.headers"
								:items="records.data"
								:page.sync="records.page.currentPage"
								:items-per-page.sync="records.page.perPage"
								:hide-default-footer="true"
								:disable-sort="true"
							>
								<template v-slot:item.description="{ item }">
									<div :class="{
										'red--text': item.category.type === categoryType.EXPENSE,
										'green-text': item.category.type === categoryType.INCOME
									}">
										{{ item.description }}
									</div>
								</template>
								<template v-slot:item.category="{ item }">
									<div :class="{
										'red--text': item.category.type === categoryType.EXPENSE,
										'green-text': item.category.type === categoryType.INCOME
									}">
										<span>
											<v-icon color="green" v-if="item.category.type === categoryType.INCOME">mdi-plus</v-icon>
											<v-icon color="red" v-if="item.category.type === categoryType.EXPENSE">mdi-minus</v-icon>
										</span>
										<span>{{ item.category.name }}</span>
										<span> / </span>
										<span>{{ item.subCategory.name }}</span>
									</div>
								</template>
								<template v-slot:item.amount="{ item }">
									<span class="red--text" v-if="item.category.type === categoryType.EXPENSE">-${{ item.amount | currency }}</span>
									<span class="green--text" v-if="item.category.type === categoryType.INCOME">${{ item.amount | currency }}</span>
								</template>
								<template v-slot:item.datetime="{ item }">
									<span class="red--text" v-if="item.category.type === categoryType.EXPENSE">{{ item.datetime | datetime }}</span>
									<span class="green--text" v-if="item.category.type === categoryType.INCOME">{{ item.datetime | datetime }}</span>
								</template>
							</v-data-table>
							<v-pagination v-model="records.page.currentPage" :length="records.page.totalPages" :total-visible="9" @input="getRecords(records.page.currentPage)"></v-pagination>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script lang="ts">
	import Vue from "vue";
	import FigurePlate from "@/components/card/FigurePlate.vue";
	import moment from "moment";
	import RecordService from "@/services/records/RecordService.ts";
	import { RecordCategoryType } from "@/models/records/RecordEnums.ts";
	import { Record } from "@/models/records/Record.ts";
	import { PageDto } from "@/helpers/PagedItems.ts";

	export default Vue.extend({
		name: "Dashboard",
		components: { FigurePlate },
		computed: {
			headingDate(): string {
				return moment().format("MMMM Y");
			}
		},
		data() {
			return {
				categoryType: {
					EXPENSE: RecordCategoryType.EXPENSE,
					INCOME: RecordCategoryType.INCOME,
				},
				records: {
					headers: [
						{ text: "Description", value: "description" },
						{ text: "Category", value: "category" },
						{ text: "Amount", value: "amount"},
						{ text: "Date & time", value: "datetime"},
					],
					data: [] as Array<Record>,
					page: new PageDto(),
				},
			}
		},

		methods: {
			async getRecords(page = 1): Promise<void> {
				const response = await RecordService.getRecords(page, 5);

				if (response) {
					this.records.data = response.items;
					this.records.page = response.page;
				}
			}
		},

		async mounted() {
			await this.getRecords();
		}
	});
</script>

<style scoped>

</style>
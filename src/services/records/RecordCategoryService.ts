import PagedItems, { PagedItemsDto } from "@/helpers/PagedItems";
import RecordCategory, { RecordCategoryDto } from "@/models/records/RecordCategory";
import { AxiosResponse } from "axios";
import { Api, ApiResponse } from "@/base/api/Api";

export default class RecordCategoryService {

    /**
     * Get record categories.
     *
     * @param page
     * @param perPage
     */
    public static async getCategories(page = 1, perPage: number|null = null): Promise<PagedItems<RecordCategory>|null> {
        const response: AxiosResponse<ApiResponse<PagedItemsDto<RecordCategoryDto>>> = await Api.getInstance().get('/record/categories', {
            params: {
                page: page,
                perPage: perPage,
            }
        });

        if (response.status === 200) {
            const dto = new PagedItemsDto<RecordCategory>()
            dto.page = response.data.payload.page;
            dto.items = response.data.payload.items.map((category) => {
                return new RecordCategory(category);
            });

            return new PagedItems(dto);
        }

        return null;
    }
}
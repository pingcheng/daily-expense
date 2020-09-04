import PagedItems, { PagedItemsDto } from "@/helpers/PagedItems";
import RecordCategory, { RecordCategoryDto } from "@/models/records/RecordCategory";
import { AxiosResponse } from "axios";
import { Api, ApiResponse } from "@/base/api/Api";
import PaginationData from "@/helpers/pagination/PaginationData";

export default class RecordCategoryService {

    /**
     * Get record categories.
     *
     * @param paginationData
     */
    public static async getCategories(paginationData: PaginationData|null = null): Promise<PagedItems<RecordCategory>|null> {

        if (paginationData === null) {
            paginationData = new PaginationData();
        }

        const response: AxiosResponse<ApiResponse<PagedItemsDto<RecordCategoryDto>>> = await Api.getInstance().get('/record/categories', {
            params: {
                page: paginationData.requestPage,
                perPage: paginationData.itemsPerPage,
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
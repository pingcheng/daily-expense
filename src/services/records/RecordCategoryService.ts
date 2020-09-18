import PagedItems, { PagedItemsDto } from "@/helpers/PagedItems";
import RecordCategory, { RecordCategoryDto } from "@/models/records/RecordCategory";
import { AxiosResponse } from "axios";
import { Api, ApiResponse } from "@/base/api/Api";
import PaginationData from "@/helpers/pagination/PaginationData";
import RecordSubCategory, { RecordSubCategoryDto } from "@/models/records/RecordSubCategory";
import GeneralErrorResponse from "@/base/api/errors/GeneralErrorResponse";
import FormErrorResponse, { FormError } from "@/base/api/errors/FormErrorResponse";

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

    public static async getSubCategories(categoryId: number, paginationData: PaginationData = new PaginationData()): Promise<PagedItems<RecordSubCategory>|null> {
        const response: AxiosResponse<ApiResponse<PagedItemsDto<RecordSubCategoryDto>>> = await Api.getInstance().get(`/record/category/${categoryId}/subcategories`, {
            params: {
                page: paginationData.requestPage,
                perPage: paginationData.itemsPerPage,
            }
        });

        if (response.status === 200) {
            const dto = new PagedItemsDto<RecordSubCategory>();
            dto.page = response.data.payload.page;
            dto.items = response.data.payload.items.map((dto) => {
                return new RecordSubCategory(dto);
            });

            return new PagedItems(dto);
        }

        return null;
    }
    
    public static async createCategory(categoryDto: RecordCategoryDto): Promise<RecordCategory|FormErrorResponse|GeneralErrorResponse> {
        const response: AxiosResponse<ApiResponse<RecordCategoryDto|FormError|any>> = await Api.getInstance().put(`/record/category`, {
            name: categoryDto.name,
            type: categoryDto.type,
        });

        switch (response.status) {
            case 200: return new RecordCategory(response.data.payload);
            case 422: return new FormErrorResponse(response.data.payload);
            default: return new GeneralErrorResponse(response.data.payload);
        }
    }

    public static async createSubCategory(categoryId: number, subCategoryDto: RecordSubCategoryDto): Promise<RecordSubCategory|FormErrorResponse|GeneralErrorResponse> {
        const response: AxiosResponse<ApiResponse<RecordSubCategoryDto|FormError|any>> = await Api.getInstance().put(`/record/category/${categoryId}/subcategory`, {
            name: subCategoryDto.name
        });

        switch (response.status) {
            case 200: return new RecordSubCategory(response.data.payload);
            case 422: return new FormErrorResponse(response.data.payload);
            default: return new GeneralErrorResponse(response.data.payload);
        }
    }

    /**
     * Delete a category.
     *
     * @param categoryId
     */
    public static async deleteCategory(categoryId: number): Promise<true|GeneralErrorResponse> {
        const response: AxiosResponse<ApiResponse<null>> = await Api.getInstance().delete(`/record/category/${categoryId}`);

        if (response.status === 200) {
            return true;
        } else {
            return new GeneralErrorResponse(response.data);
        }
    }

    /**
     * Delete a sub category.
     *
     * @param subCategoryId
     */
    public static async deleteSubCategory(subCategoryId: number): Promise<true|GeneralErrorResponse> {
        const response: AxiosResponse<ApiResponse<null>> = await Api.getInstance().delete(`/record/subcategory/${subCategoryId}`);

        if (response.status === 200) {
            return true;
        } else {
            return new GeneralErrorResponse(response.data);
        }
    }

    /**
     * Update a category
     *
     * @param category
     */
    public static async updateCategory(category: RecordCategoryDto): Promise<RecordCategory|FormErrorResponse|GeneralErrorResponse> {
        const response: AxiosResponse<ApiResponse<RecordCategoryDto|FormError>> = await Api.getInstance().patch(`/record/category/${category.id}`, {
            name: category.name
        });

        switch (response.status) {
            case 200: return new RecordCategory(response.data.payload as RecordCategoryDto);
            case 422: return new FormErrorResponse(response.data.payload as FormError);
            default: return new GeneralErrorResponse(response.data);
        }
    }
}
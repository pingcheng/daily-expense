import { Record, RecordDto } from "@/models/records/Record.ts";
import { AxiosResponse } from "axios";
import { Api, ApiResponse } from "@/base/api/Api.ts";
import PagedItems, { PagedItemsDto } from "@/helpers/PagedItems.ts";

export default class RecordService {

    public static async getRecords(page = 1, perPage: number|null = null): Promise<PagedItems<Record>|null> {
        const response: AxiosResponse<ApiResponse<PagedItemsDto<RecordDto>>> = await Api.getInstance().get('/records', {
            params: {
                page: page,
                perPage: perPage,
            }
        });

        if (response.status === 200) {
            const dto = new PagedItemsDto<Record>();
            dto.page = response.data.payload.page;
            dto.items = response.data.payload.items.map((item) => {
                return new Record(item);
            });

            return new PagedItems(dto);
        }

        return null;
    }
}
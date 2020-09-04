import { RecordCategoryType } from "@/models/records/RecordEnums.ts";

export interface RecordCategoryInterface {
    id: number;
    name: string;
    type: RecordCategoryType;
}

export class RecordCategoryDto implements RecordCategoryInterface {
    id = 0;
    name = '';
    type = RecordCategoryType.EXPENSE;
}

export default class RecordCategory extends RecordCategoryDto {
    constructor(dto: RecordCategoryDto|null = null) {
        super();

        if (!dto) {
            dto = new RecordCategoryDto();
        }

        Object.assign(this, dto);
    }
}
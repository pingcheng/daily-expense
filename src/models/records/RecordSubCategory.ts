export interface RecordSubCategoryInterface {
    id: number;
    name: string;
}

export class RecordSubCategoryDto implements RecordSubCategoryInterface {
    id = 0;
    name = '';
}

export default class RecordSubCategory extends RecordSubCategoryDto {
    constructor(dto: RecordSubCategoryDto|null = null) {
        super();

        if (!dto) {
            dto = new RecordSubCategoryDto();
        }

        Object.assign(this, dto);
    }
}
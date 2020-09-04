import RecordSubCategory, {
    RecordSubCategoryDto,
    RecordSubCategoryInterface
} from "@/models/records/RecordSubCategory.ts";
import RecordCategory, { RecordCategoryDto, RecordCategoryInterface } from "@/models/records/RecordCategory.ts";
import moment from "moment";

export interface RecordInterface {
    id: number;
    description: string;
    amount: number;
    datetime: string;
    category: RecordCategoryInterface;
    subCategory: RecordSubCategoryInterface;
}

export class RecordDto implements RecordInterface {
    id = 0;
    description = "";
    amount = 0;
    datetime = "";
    category = new RecordCategoryDto();
    subCategory = new RecordSubCategoryDto();
}

export class Record extends RecordDto {

    private parsedDatetime: moment.Moment;

    constructor(dto: RecordDto|null = null) {
        super();

        if (!dto) {
            dto = new RecordDto();
        }

        Object.assign(this, dto);

        // Convert from dto to object.
        this.category = new RecordCategory(this.category);
        this.subCategory = new RecordSubCategory(this.subCategory);

        this.parsedDatetime = moment(this.datetime);
    }

    get dateTimeString(): string {
        return this.parsedDatetime.format("YYYY-mm-dd h:i:s");
    }
}
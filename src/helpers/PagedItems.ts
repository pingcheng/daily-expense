export interface PageInterface {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
}

export interface PagedItemsInterface<T> {
    page: PageInterface;
    items: Array<T>;
}

export class PageDto implements PageInterface {
    currentPage = 0;
    totalPages = 0;
    totalItems = 0;
    perPage = 0;
}

export class PagedItemsDto<T> implements PagedItemsInterface<T> {
    page = new PageDto();
    items = [] as Array<T>;
}

export default class PagedItems<T> extends PagedItemsDto<T> {
    constructor(dto: PagedItemsDto<T>|null = null) {
        super();
        if (dto === null) {
            dto = new PagedItemsDto<T>();
        }
        Object.assign(this, dto);
    }
}
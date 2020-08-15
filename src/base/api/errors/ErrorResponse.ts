export default class ErrorResponse {
    private readonly errorType: ErrorType;

    constructor(errorType: ErrorType) {
        this.errorType = errorType;
    }

    public getType(): ErrorType {
        return this.errorType;
    }

}

export enum ErrorType {
    FORM_ERROR
}
import ErrorResponse, { ErrorType } from "@/base/api/errors/ErrorResponse";
import { ApiResponse } from "@/base/api/Api";

export default class GeneralErrorResponse extends ErrorResponse {

    private readonly error: ApiResponse<any>;

    public constructor(error: ApiResponse<any>) {
        super(ErrorType.GENERAL_ERROR);
        this.error = error;
    }

    public getErrorMessage(): string {
        return this.error.message;
    }
}
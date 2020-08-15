import ErrorResponse, { ErrorType } from "@/base/api/errors/ErrorResponse.ts";

export default class FormErrorResponse extends ErrorResponse {

    private readonly errors: FormError;

    public constructor(errors: FormError) {
        super(ErrorType.FORM_ERROR);
        this.errors = errors;
    }

    public getErrors(): FormError {
        return this.errors;
    }

    public getError(key: string): Array<string> | null {
        if (Object.prototype.hasOwnProperty.call(this.errors, key)) {
            return this.errors[key];
        }

        return null;
    }

    public getErrorKeys(): Array<string> {
        return Object.keys(this.errors)
    }
}

export interface FormError {
    [key: string]: Array<string>;
}
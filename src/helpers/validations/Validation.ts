/**
 * Clear all the error messages in the referenced parameter.
 *
 * @param messages
 */
import { FormError } from "@/base/api/errors/FormErrorResponse.ts";

export function clearErrorMessages(messages: ErrorMessages): void {
    Object.keys(messages).forEach((key) => {
        messages[key] = [];
    });
}

/**
 * Apply all the messages from the form errors.
 *
 * @param messages
 * @param errors
 */
export function applyErrorMessages(messages: ErrorMessages, errors: FormError): void {
    Object.keys(errors).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(messages, key)) {
            messages[key] = errors[key];
        }
    });
}

interface ErrorMessages {
    [key: string]: Array<string>;
}
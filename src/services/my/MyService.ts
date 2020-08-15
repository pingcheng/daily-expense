import User, { UserDTO } from "@/models/users/User";
import { Api, ApiResponse } from "@/base/api/Api";
import { AxiosResponse } from "axios";
import FormErrorResponse, { FormError } from "@/base/api/errors/FormErrorResponse.ts";

export default class MyService {
    public static async getMyInfo(): Promise<User|null> {
        const api = Api.getInstance();
        const response: AxiosResponse<ApiResponse<UserDTO>> = await api.get('/my');

        if (response.status === 200) {
            return new User(response.data.payload);
        }

        return null;
    }

    /**
     * Update the current user's password.
     *
     * @param currentPassword
     * @param newPassword
     */
    public static async updatePassword(currentPassword: string, newPassword: string): Promise<boolean|FormErrorResponse> {
        const response: AxiosResponse<ApiResponse<null|FormError>> = await Api.getInstance().post('/my/password', {
            currentPassword,
            newPassword
        });

        switch (response.status) {
            case 422: return new FormErrorResponse(response.data.payload as FormError);
            case 200: return true;
            default: return false;
        }
    }
}
import User, { UserDTO } from "@/models/users/User";
import { Api, ApiResponse } from "@/base/api/Api";
import { AxiosResponse } from "axios";

export default class MyService {
    public static async getMyInfo(): Promise<User|null> {
        const api = Api.getInstance();
        const response: AxiosResponse<ApiResponse<UserDTO>> = await api.get('/my');

        if (response.status === 200) {
            return new User(response.data.payload);
        }

        return null;
    }
}
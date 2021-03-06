import { LoginCredential } from "@/models/auth/LoginCredential";
import { Api, ApiResponse } from "@/base/api/Api";
import FormErrorResponse, { FormError } from "@/base/api/errors/FormErrorResponse.ts";
import { AxiosResponse } from "axios";
import AuthToken, { AuthTokenDto } from "@/models/auth/AuthToken";
import moment from "moment";
import { AuthTokenService } from "@/services/auth/AuthTokenService";
import RegisterPayload from "@/models/auth/RegisterPayload";

export class AuthService {
    public static async login(credential: LoginCredential): Promise<AuthToken|FormErrorResponse|null> {
        const api = Api.getInstance();
        const response: AxiosResponse<ApiResponse<LoginResponsePayload|FormError>> = await api.post('/auth/login', {
            email: credential.getEmail(),
            password: credential.getPassword()
        });

        if (response.status === 200) {
            const tokenDto = new AuthTokenDto();
            const payload = response.data.payload as LoginResponsePayload;
            tokenDto.accessToken = payload.token.accessToken;
            tokenDto.expiresAt = moment(payload.token.expires);
            AuthTokenService.persist(tokenDto);
            return new AuthToken(tokenDto);
        } else if (response.status === 422) {
            return new FormErrorResponse(response.data.payload as FormError);
        }

        return null;
    }

    public static async register(registerPayload: RegisterPayload): Promise<boolean|FormErrorResponse> {
        const response: AxiosResponse<ApiResponse<null|FormError>> = await Api.getInstance().post('/auth/register', {
            email: registerPayload.getEmail(),
            name: registerPayload.getName(),
            password: registerPayload.getPassword()
        });

        if (response.status === 200) {
            return true;
        } else if (response.status === 422) {
            return new FormErrorResponse(response.data.payload as FormError);
        } else {
            return false;
        }
    }

    public static async logout(): Promise<boolean> {
        const response: AxiosResponse<ApiResponse<null>> = await Api.getInstance().post('/auth/logout');

        if (response.status === 200) {
            AuthTokenService.destroy();
            return true;
        } else {
            return false;
        }
    }
}

interface LoginResponsePayload {
    user: {
        id: number;
        name: string;
    };
    token: {
        accessToken: string;
        expires: string;
    };
}
import AuthToken, { AuthTokenDto } from "@/models/auth/AuthToken";
import moment from "moment";

export class AuthTokenService {

    private static readonly AUTH_TOKEN = "auth_token";
    private static readonly AUTH_TOKEN_EXPIRES = "auth_token_expires";

    public static persist(token: AuthTokenDto) {
        this.destroy();
        localStorage.setItem(this.AUTH_TOKEN, token.accessToken);
        localStorage.setItem(this.AUTH_TOKEN_EXPIRES, token.expiresAt.valueOf().toString())
    }

    public static get(): AuthToken|null {
        const token = localStorage.getItem(this.AUTH_TOKEN);
        const tokenExpiresAt = localStorage.getItem(this.AUTH_TOKEN_EXPIRES);

        if (token === null || tokenExpiresAt === null) {
            return null;
        }

        const authTokenDto = new AuthTokenDto();
        authTokenDto.accessToken = token;
        authTokenDto.expiresAt = moment(parseInt(tokenExpiresAt));

        const authToken = new AuthToken(authTokenDto);

        if (authToken.isExpired()) {
            this.destroy();
            return null;
        }

        return authToken;
    }

    public static destroy(): void {
        localStorage.removeItem(this.AUTH_TOKEN);
        localStorage.removeItem(this.AUTH_TOKEN_EXPIRES);
    }
}
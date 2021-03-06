import moment from "moment";

export interface AuthTokenInterface {
    accessToken: string;
    expiresAt: moment.Moment;
}

export class AuthTokenDto implements AuthTokenInterface {
    accessToken = "";
    expiresAt = moment();
}

export default class AuthToken extends AuthTokenDto {
    constructor(dto: AuthTokenDto) {
        super();
        Object.assign(this, dto);
    }

    isExpired(): boolean {
        return moment().isAfter(this.expiresAt);
    }

    needRefresh(): boolean {
        return this.expiresAt.diff(moment(), 'days') < 7;
    }

    getHeaderString(): string {
        return `Bearer ${this.accessToken}`;
    }
}
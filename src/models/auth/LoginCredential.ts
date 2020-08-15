export class LoginCredential {

    private readonly email: string;
    private readonly password: string;

    public static with(email: string, password: string) {
        return new LoginCredential(email, password);
    }

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }
}
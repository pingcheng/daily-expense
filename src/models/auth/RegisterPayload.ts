export default class RegisterPayload {
    private readonly email: string;
    private readonly name: string;
    private readonly password: string;

    constructor(
        email: string,
        name: string,
        password: string,
    ) {
        this.email = email;
        this.name = name;
        this.password = password;
    }

    public getEmail(): string {
        return this.email;
    }

    public getName(): string {
        return this.name;
    }

    public getPassword(): string {
        return this.password;
    }
}
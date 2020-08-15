export interface UserInterface {
    id: number;
    email: string;
    name: string;
    avatar: string;
}

export class UserDTO implements UserInterface {
    id = 0;
    email = '';
    name = '';
    avatar = '';
}

export default class User extends UserDTO {
    constructor(dto: UserDTO) {
        super();
        Object.assign(this, dto);
    }
}
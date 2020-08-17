export interface UserInterface {
    id: number;
    email: string;
    name: string;
    avatar: string;
}

export class UserDto implements UserInterface {
    id = 0;
    email = '';
    name = '';
    avatar = '';
}

export default class User extends UserDto {
    constructor(dto: UserDto) {
        super();
        Object.assign(this, dto);
    }
}
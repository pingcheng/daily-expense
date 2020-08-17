import { UserDTO } from "@/models/users/User.ts";
import { ConfigurationDto } from "@/base/config/Configuration.ts";

export default interface RootState {
    my: UserDTO
    config: ConfigurationDto
}
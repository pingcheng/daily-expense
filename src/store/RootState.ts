import { UserDto } from "@/models/users/User.ts";
import { ConfigurationDto } from "@/base/config/Configuration.ts";

export default interface RootState {
    profile: UserDto
    config: ConfigurationDto
}
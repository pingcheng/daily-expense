import User, { UserDTO } from "@/models/users/User";
import { Module } from "vuex";
import RootState from "@/store/RootState.ts";

const MyInfoStore: Module<UserDTO, RootState> = {
    namespaced: true,
    state: {
        id: 0,
        name: '',
        email: '',
        avatar: '',
    },

    mutations: {
        update(state: UserDTO, user: User) {
            state.id = user.id;
            state.name = user.name;
            state.email = user.name;
            state.avatar = user.avatar;
        }
    }
}

export default MyInfoStore;
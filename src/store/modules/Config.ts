import { Configuration, ConfigurationDto } from "@/base/config/Configuration.ts";
import { Module } from "vuex";
import RootState from "@/store/RootState.ts";

const config = new ConfigurationDto();
const ConfigStore: Module<ConfigurationDto, RootState> = {
    namespaced: true,
    state: {
        showSidebar: config.showSidebar
    },
    mutations: {
        update(state: ConfigurationDto, config: Configuration) {
            Object.assign(state, config);
        }
    }
}

export default ConfigStore;
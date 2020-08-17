import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import ProfileStore from "@/store/modules/ProfileStore.ts";
import ConfigStore from "@/store/modules/ConfigStore.ts";
import RootState from "@/store/RootState.ts";

Vue.use(Vuex)

const options: StoreOptions<RootState> = {
  modules: {
    profile: ProfileStore,
    config: ConfigStore,
  }
}

export default new Vuex.Store(options);

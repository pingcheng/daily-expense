import Vue from 'vue'
import Vuex from 'vuex'
import ProfileStore from "@/store/modules/ProfileStore.ts";
import ConfigStore from "@/store/modules/ConfigStore.ts";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    profile: ProfileStore,
    config: ConfigStore,
  }
})

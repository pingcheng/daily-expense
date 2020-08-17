import Vue from 'vue'
import Vuex from 'vuex'
import MyInfoStore from "@/store/modules/MyInfoStore";
import ConfigStore from "@/store/modules/Config.ts";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    my: MyInfoStore,
    config: ConfigStore,
  }
})

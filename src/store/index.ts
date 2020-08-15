import Vue from 'vue'
import Vuex from 'vuex'
import MyInfoStore from "@/store/modules/MyInfoStore";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    my: MyInfoStore
  }
})

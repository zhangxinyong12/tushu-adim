import Vue from 'vue';
import Vuex from 'Vuex';
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        name : "admin"
    },
    mutations: {
        setName(state,palyload) {
            this.state.name = palyload;
            console.log(this.state.name)
        }
    }
})
export default store
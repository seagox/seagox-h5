import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        clientWidth: 0,
        clientHeight: 0,
        offsetTop: 0,
        tabBarHeight: 0,
        tabbarShow: true,
        applyTabbarShow: true
    },
    mutations: {
        updateClientWidth(state, payload) {
            state.clientWidth = payload
        },
        updateClientHeight(state, payload) {
            state.clientHeight = payload
        },
        updateOffsetTop(state, payload) {
            state.offsetTop = payload
        },
        updateTabBarHeight(state, payload) {
            state.tabBarHeight = payload
        },
        updateTabbarShow(state, payload) {
            state.tabbarShow = payload
        },
        updateApplyTabbarShow(state, payload) {
            state.applyTabbarShow = payload
        }
    },
    actions: {
        updateClientWidth(context, args) {
            context.commit('updateClientWidth', args)
        },
        updateClientHeight(context, args) {
            context.commit('updateClientHeight', args)
        },
        updateOffsetTop(context, args) {
            context.commit('updateOffsetTop', args)
        },
        updateTabBarHeight(context, args) {
            context.commit('updateTabBarHeight', args)
        },
        updateTabbarShow(context, args) {
            context.commit('updateTabbarShow', args)
        },
        updateApplyTabbarShow(context, args) {
            context.commit('updateApplyTabbarShow', args)
        }
    }
})

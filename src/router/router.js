import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/DashBoard.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    hashbang: false,
    routes: [
        {
            path: '/',
            redirect: '/starships'
        },
        {
            path: '/starships',
            name: 'Starships',
            component: Dashboard
        },
        {
            path: '/planets',
            name: 'Planets',
            component: Dashboard
        },
        {
            path: '/people',
            name: 'People',
            component: Dashboard
        }
    ]
})

export default router

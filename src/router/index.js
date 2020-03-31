import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Index = () => import('../views/index.vue')

const routes = [
    {
        path: '*',
        redirect: '/index'
    },
    {
        name: 'index',
        path: '/index',
        component: Index
    }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: '/',
        redirect: '/login'
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login.vue'),
        meta: {
            title: '登陆',
            requiredAuth: false
        }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue'),
        meta: {
            title: '首页',
            requiredAuth: true
        }
    },
    {
        path: '/workspace',
        name: 'workspace',
        component: () => import('@/views/workspace.vue'),
        meta: {
            title: '工作区',
            requiredAuth: true
        }
    },
    {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/mine.vue'),
        meta: {
            title: '我的',
            requiredAuth: true
        }
    },
    {
        path: '/submitView',
        name: 'submitView',
        component: () => import('@/views/submit-view.vue'),
        meta: {
            title: '提交表单',
            requiredAuth: true
        }
    },
    {
        path: '/handleApproval',
        name: 'handleApproval',
        component: () => import('@/views/handle-approval.vue'),
        meta: {
            title: '处理审批',
            requiredAuth: true
        }
    },
    {
        path: '/formEdit',
        name: 'formEdit',
        component: () => import('@/views/form-edit.vue'),
        meta: {
            title: '表单编辑',
            requiredAuth: true
        }
    },
    {
        path: '/todo',
        name: 'todo',
        component: () => import('@/views/todo.vue'),
        meta: {
            title: '待办事项',
            requiredAuth: true
        }
    },
    {
        path: '/done',
        name: 'done',
        component: () => import('@/views/done.vue'),
        meta: {
            title: '已办事项',
            requiredAuth: true
        }
    },
    {
        path: '/self',
        name: 'self',
        component: () => import('@/views/self.vue'),
        meta: {
            title: '我发起的',
            requiredAuth: true
        }
    },
    {
        path: '/copy',
        name: 'copy',
        component: () => import('@/views/copy.vue'),
        meta: {
            title: '抄送我的',
            requiredAuth: true
        }
    },
    {
        path: '/formList',
        name: 'formList',
        component: () => import('@/views/form-list.vue'),
        meta: {
            title: '列表',
            requiredAuth: true
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    //base: 'oa-h5',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        if (to.query.title) {
            document.title = to.query.title
        } else {
            document.title = to.meta.title
        }
    }
    var authorization = localStorage.getItem('Authorization')
    if (authorization || !to.meta.requiredAuth) {
        next()
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    }
})

export default router

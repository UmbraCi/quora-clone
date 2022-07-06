import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginIndex from '../views/Login/index.vue';
import HomeIndex from '@/views/Home/index.vue';
import store from '@/store';
import axios from '@/libs/http';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'LoginIndex',
        component: LoginIndex,
        meta: { redirectAlreadyLogin: true },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import(/* webpackChunkName: "Signup" */ '@/views/signup/index.vue'),
        meta: { redirectAlreadyLogin: true },
    },
    {
        path: '/',
        name: 'Home',
        component: HomeIndex,
    },
    {
        path: '/column/:id',
        name: 'columnDetail',
        component: () => import(/* webpackChunkName: "column" */ '@/views/ColumnDetail/index.vue'),
    },
    {
        path: '/create',
        name: 'CreatePost',
        component: () => import(/* webpackChunkName: "Post" */ '@/views/CreatePost/index.vue'),
        meta: { requiredLogin: true },
    },

    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const { user, token } = store.state;
    const { redirectAlreadyLogin, requiredLogin } = to.meta;
    if (!user.isLogin) {
        //没有登录
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            store
                .dispatch('fetchCurrentUser')
                .then(() => {
                    if (redirectAlreadyLogin) {
                        next('/');
                    } else {
                        next();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    store.commit('logout');
                    next('login');
                });
        } else {
            //  VUEx中没有token
            if (requiredLogin) {
                next('login');
            } else {
                next();
            }
        }
    } else {
        //已登录
        if (redirectAlreadyLogin) {
            next('/');
        } else {
            next();
        }
    }
});

export default router;

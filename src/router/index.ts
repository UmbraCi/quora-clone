import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginIndex from '../views/Login/index.vue';
import HomeIndex from '@/views/Home/index.vue';
import store from '@/store';

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
    console.log(store.state.user);
    if (to.meta.requiredLogin && !store.state.user.isLogin) {
        next('/login');
    } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;

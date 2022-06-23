import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginIndex from '../views/Login/index.vue';
import HomeIndex from '@/views/Home/index.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'LoginIndex',
        component: LoginIndex,
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

export default router;

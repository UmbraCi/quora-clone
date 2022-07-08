import { createStore, Commit } from 'vuex';
import { currentUser } from './testData';
import { PostProps, ColumnProps, UserProps } from './types';
import axios, { AxiosRequestConfig } from '@/libs/http';
import { storageType, StorageHandler } from '@/libs/storage';

const storageHandler = new StorageHandler();

export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}

export interface GlobalDataProps {
    token: string;
    error: GlobalErrorProps;
    loading: boolean;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}

//封装请求
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
    const { data } = await axios(url, config);
    commit(mutationName, data);
    return data;
};

export default createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        token: storageHandler.getItem(storageType, 'token') || '',
        loading: false,
        columns: [],
        posts: [],
        user: currentUser,
    },
    getters: {
        getColumnById(state) {
            return (id: string) => {
                return state.columns.find((c) => c._id === id);
            };
        },
        getPostsByCid(state) {
            return (cid: string) => {
                return state.posts.filter((post) => post.column == cid);
            };
        },
        getCurrentPost(state) {
            return (id: string) => {
                return state.posts.find((c) => c._id == id);
            };
        },
    },
    mutations: {
        // login(state) {
        //     state.user = { ...state.user, isLogin: true, name: 'UmbraCi' };
        // },
        createPost(state, newPost) {
            state.posts.push(newPost);
        },
        fetchColumns(state, columns) {
            state.columns = columns.data.list;
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data];
        },
        fetchPosts(state, rawData) {
            state.posts = rawData.data.list;
        },
        fetchPost(state, rawData) {
            // 更新替换对应的post的数据
            const targetId = rawData.data._id;
            const oldIndex = state.posts.findIndex((c) => c._id === targetId);
            const newPost = rawData.data;
            state.posts.splice(oldIndex, 1, newPost);
        },
        updatePost(state, rawData) {
            state.posts = state.posts.map((post) => {
                if (post._id === rawData.data._id) {
                    return rawData.data;
                } else {
                    return post;
                }
            });
        },
        deletePost(state, { data }) {
            state.posts = state.posts.filter((post) => post._id !== data._id);
        },
        setLoading(state, status) {
            state.loading = status;
        },
        login(state, rawData) {
            const { token } = rawData.data;
            state.token = token;
            storageHandler.setItem(storageType, 'token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        //退出
        logout(state) {
            state.token = '';
            state.user = { isLogin: false };
            storageHandler.remove(storageType, 'token');
            delete axios.defaults.headers.common.Authorization;
        },
        fetchCurrentUser(state, rawData) {
            state.user = { ...rawData.data, isLogin: true };
        },
        setError(state, e: GlobalErrorProps) {
            state.error = e;
        },
    },
    actions: {
        fetchColumns({ commit }) {
            // axios.get('/api/columns').then((res) => {
            //     commit('fetchColumns', res.data);
            // });
            return asyncAndCommit('/api/columns', 'fetchColumns', commit);
        },
        fetchColumn({ commit }, cid) {
            // axios.get(`/api/columns/${cid}`).then((res) => {
            //     commit('fetchColumn', res.data);
            // });
            return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit);
        },
        fetchPosts({ commit }, cid) {
            // axios.get(`/api/columns/${cid}/posts`).then((res) => {
            //     commit('fetchPosts', res.data);
            // });
            return asyncAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit);
        },
        fetchPost({ commit }, id) {
            return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit);
        },
        login({ commit }, payload) {
            return asyncAndCommit('/api/user/login', 'login', commit, { method: 'post', data: payload });
        },
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit);
        },
        // 登录并获取用户信息
        loginAndFetch({ dispatch }, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser');
            });
        },
        register({ commit }, payload) {
            return asyncAndCommit('/api/users', 'register', commit, { method: 'post', data: payload });
        },
        createPost({ commit }, payload) {
            return asyncAndCommit('/api/posts', 'createPost', commit, { method: 'post', data: payload });
        },
        updatePost({ commit }, { id, payload }) {
            return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, { method: 'patch', data: payload });
        },
        deletePost({ commit }, id) {
            return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, {
                method: 'delete',
            });
        },
    },
    modules: {},
});

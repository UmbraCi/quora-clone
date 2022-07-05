import { createStore, Commit } from 'vuex';
import { currentUser } from './testData';
import { PostProps, ColumnProps, UserProps } from './types';
import axios from '@/libs/http';
import { StorageType, StorageHandler } from '@/libs/storage';

const storageType = StorageType.Local;
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
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url);
    commit(mutationName, data);
};

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload);
    commit(mutationName, data);
    return data; //返回数据
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
        setLoading(state, status) {
            state.loading = status;
        },
        login(state, rawData) {
            const { token } = rawData.data;
            state.token = token;
            storageHandler.setItem(storageType, 'token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
            getAndCommit('/api/columns', 'fetchColumns', commit);
        },
        fetchColumn({ commit }, cid) {
            // axios.get(`/api/columns/${cid}`).then((res) => {
            //     commit('fetchColumn', res.data);
            // });
            getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit);
        },
        fetchPosts({ commit }, cid) {
            // axios.get(`/api/columns/${cid}/posts`).then((res) => {
            //     commit('fetchPosts', res.data);
            // });
            getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit);
        },
        login({ commit }, payload) {
            return postAndCommit('/api/user/login', 'login', commit, payload);
        },
        fetchCurrentUser({ commit }) {
            return getAndCommit('/api/user/current', 'fetchCurrentUser', commit);
        },
        // 登录并获取用户信息
        loginAndFetch({ dispatch }, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser');
            });
        },
        register({ commit }, payload) {
            return postAndCommit('/api/users', 'register', commit, payload);
        },
    },
    modules: {},
});

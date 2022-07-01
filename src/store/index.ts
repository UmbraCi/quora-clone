import { createStore } from 'vuex';
import { currentUser } from './testData';
import { PostProps, ColumnProps, UserProps } from './types';
import axios from '@/libs/http';

export interface GlobalDataProps {
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}

export default createStore<GlobalDataProps>({
    state: {
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
        login(state) {
            state.user = { ...state.user, isLogin: true, name: 'UmbraCi' };
        },
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
    },
    actions: {
        fetchColumns({ commit }) {
            axios.get('/api/columns').then((res) => {
                commit('fetchColumns', res.data);
            });
        },
        fetchColumn({ commit }, cid) {
            axios.get(`/api/columns/${cid}`).then((res) => {
                commit('fetchColumn', res.data);
            });
        },
        fetchPosts({ commit }, cid) {
            axios.get(`/api/columns/${cid}/posts`).then((res) => {
                commit('fetchPosts', res.data);
            });
        },
    },
    modules: {},
});

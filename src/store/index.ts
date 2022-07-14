import { createStore, Commit } from 'vuex';
import { currentUser } from './testData';
import { PostProps, ColumnProps, UserProps } from './types';
import axios, { AxiosRequestConfig } from '@/libs/http';
import { storageType, StorageHandler } from '@/libs/storage';
import { arrToObj, objToArr } from '@/helper';
import { LoadParams } from '@/hooks/useLoadMore';

const storageHandler = new StorageHandler();

interface ListProps<P> {
    [id: string]: P;
}

export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}
export interface LoadedPostProps {
    columnId: string;
    currentPage: number;
    total: number;
}

export interface GlobalDataProps {
    token: string;
    error: GlobalErrorProps;
    loading: boolean;
    columns: {
        data: ListProps<ColumnProps>;
        currentPage: number;
        total: number;
    };
    posts: {
        data: ListProps<PostProps>;
        loadedColumns: ListProps<LoadedPostProps>;
    };
    user: UserProps;
}

//封装请求
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
    const { data } = await axios(url, config);
    if (extraData) {
        commit(mutationName, { data, extraData });
    } else {
        commit(mutationName, data);
    }

    return data;
};

export default createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        token: storageHandler.getItem(storageType, 'token') || '',
        loading: false,
        columns: {
            data: {},
            currentPage: 0,
            total: 0,
        },
        posts: {
            data: {},
            loadedColumns: {},
        },
        user: currentUser,
    },
    getters: {
        getColumnById(state) {
            return (id: string) => {
                return state.columns.data[id];
            };
        },
        getPostsByCid(state) {
            return (cid: string) => {
                return objToArr(state.posts.data).filter((post) => post.column == cid);
            };
        },
        getCurrentPost(state) {
            return (id: string) => {
                return state.posts.data[id];
            };
        },
        getColumns: (state) => {
            return objToArr(state.columns.data);
        },
        getLoadedPosts: (state) => (id: string) => {
            return state.posts.loadedColumns[id];
        },
    },
    mutations: {
        createPost(state, newPost) {
            state.posts.data[newPost._id] = newPost;
        },
        fetchColumns(state, rawData) {
            const { data } = state.columns;
            const { list, count, currentPage } = rawData.data;
            state.columns = {
                data: { ...data, ...arrToObj(list) },
                total: count,
                currentPage: currentPage * 1, //*1是为了转换为number  避免是string类型
            };
            // state.columns.isLoaded = true;
            // state.columns.data = arrToObj(rawData.data.list);
        },
        fetchColumn(state, rawData) {
            state.columns.data[rawData.data._id] = rawData.data;
        },
        fetchPosts(state, { data: rawData, extraData: columnId }) {
            const { data } = state.posts;
            const { list, count, currentPage } = rawData.data;
            state.posts.data = { ...data, ...arrToObj(list) };
            state.posts.loadedColumns[columnId] = {
                columnId: columnId,
                total: count,
                currentPage: currentPage * 1,
            };
        },
        fetchPost(state, rawData) {
            // 更新替换对应的post的数据
            state.posts.data[rawData.data._id] = rawData.data;
        },
        updatePost(state, rawData) {
            state.posts.data[rawData.data._id] = rawData.data;
        },
        deletePost(state, { data }) {
            delete state.posts.data[data._id];
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
        fetchColumns({ state, commit }, params = {}) {
            const { currentPage = 1, pageSize = 6 } = params as LoadParams;
            if (state.columns.currentPage < currentPage) {
                return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit);
            }
        },
        fetchColumn({ commit }, cid) {
            return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit);
        },
        fetchPosts({ state, commit }, params = {}) {
            const { columnId, currentPage = 1, pageSize = 3 } = params;
            const loadedPosts = state.posts.loadedColumns[columnId];
            if (!loadedPosts) {
                return asyncAndCommit(
                    `/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
                    'fetchPosts',
                    commit,
                    { method: 'get' },
                    columnId
                );
            } else {
                const loadedPostCurrentPage = loadedPosts.currentPage || 0;
                if (loadedPostCurrentPage < currentPage) {
                    return asyncAndCommit(
                        `/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
                        'fetchPosts',
                        commit,
                        { method: 'get' },
                        columnId
                    );
                }
            }
        },
        fetchPost({ state, commit }, id) {
            const currentPost = state.posts.data[id];
            //没有获取过内容
            if (!currentPost || !currentPost.content) {
                return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit);
            } else {
                return Promise.resolve({ data: currentPost });
            }
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

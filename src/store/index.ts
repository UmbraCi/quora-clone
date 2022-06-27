import { createStore } from 'vuex';
import { testData, testPosts } from './testData';
import { PostProps, ColumProps } from './types';
export interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
}
export interface GlobalDataProps {
    columns: ColumProps[];
    posts: PostProps[];
    user: UserProps;
}

export default createStore<GlobalDataProps>({
    state: {
        columns: testData,
        posts: testPosts,
        user: {
            isLogin: true,
        },
    },
    getters: {
        getColumnById(state) {
            return (id: number | string) => {
                return state.columns.find((c) => c.id === id);
            };
        },
        getPostById(state) {
            return (id: string) => {
                return state.posts.find((post) => post.column == id);
            };
        },
    },
    mutations: {
        login(state) {
            state.user = { ...state.user, isLogin: true, name: 'UmbraCi' };
        },
    },
    actions: {},
    modules: {},
});

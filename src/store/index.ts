import { createStore } from 'vuex';
import { testData, testPosts, currentUser } from './testData';
import { PostProps, ColumProps, UserProps } from './types';

export interface GlobalDataProps {
    columns: ColumProps[];
    posts: PostProps[];
    user: UserProps;
}

export default createStore<GlobalDataProps>({
    state: {
        columns: testData,
        posts: testPosts,
        user: currentUser,
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
        createPost(state, newPost) {
            state.posts.push(newPost);
        },
    },
    actions: {},
    modules: {},
});

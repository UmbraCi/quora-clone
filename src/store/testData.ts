import { PostProps, ColumProps, UserProps } from './types';
export const testPosts: PostProps[] = [
    {
        _id: '1',
        title: '这是我的第一篇文章',
        content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
        image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100',
        createdAt: '2020-06-11 10:34:22',
        column: '1',
    },
    {
        _id: '2',
        title: '这是我的第一篇文章',
        content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
        createdAt: '2020-06-11 10:34:22',
        column: '1',
    },
    {
        _id: '3',
        title: '这是我的第一篇文章',
        content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
        createdAt: '2020-06-11 10:34:22',
        column: '1',
    },
];
export const testData: ColumProps[] = [
    {
        id: 1,
        title: 'Vue.js',
        avatar: 'https://avatars0.githubusercontent.com/u/139426?s=460&v=4',
        description: 'Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。',
    },
    {
        id: 2,
        title: 'Vue.js',
        avatar: 'https://avatars0.githubusercontent.com/u/139426?s=460&v=4',
        description: 'Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。',
    },
    {
        id: 3,
        title: 'Vue.js',
        avatar: 'https://avatars0.githubusercontent.com/u/139426?s=460&v=4',
        description: 'Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。',
    },
    {
        id: 4,
        title: 'Vue.js',
        // avatar: "https://avatars0.githubusercontent.com/u/139426?s=460&v=4",
        description: 'Vue.js是一个基于JavaScript的渐进式框架，由Mint-UI团队开发。',
    },
];

export const currentUser: UserProps = {
    isLogin: true,
    name: 'viking',
    id: 'v_123',
    columnId: 1,
};

<template>
    <div class="container">
        <global-header :user="currentUser"></global-header>
        <router-view></router-view>
        <!-- <column-list :list="list"></column-list> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    // ColumnList,

    ColumProps,
} from '@/components/ColumnList.vue';
import GlobalHeader, { UserProps } from '@/components/GlobalHeader.vue';

const testData: ColumProps[] = [
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
const currentUser: UserProps = {
    name: 'UmbraCi',
    isLogin: true,
};

export default defineComponent({
    name: 'APP',
    components: {
        // ColumnList,
        GlobalHeader,
    },
    setup() {
        return {
            list: testData,
            currentUser,
        };
    },
});
</script>

<style lang="less"></style>

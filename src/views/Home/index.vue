<template>
    <div class="row">
        <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <img :src="column.avatar" alt="" class="rounded-circle border border-light w-25 my-3" />
                    <h5 class="card-title">{{ column.title }}</h5>
                    <p class="card-text text-left">{{ column.description }}</p>
                    <a href="" class="btn btn-outline-primary">进入专栏</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
export interface ColumProps {
    id: number;
    title: string;
    avatar?: string;
    description: string;
}

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
export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    // props: {
    //     list: {
    //         type: Array as PropType<ColumProps[]>,
    //         required: true,
    //     },
    // },

    setup() {
        const columnList = computed(() => {
            return testData.map((column) => {
                if (!column.avatar) {
                    column.avatar = require('@/assets/logo.png');
                }
                return column;
            });
        });
        return { columnList };
    },
});
</script>

<template>
    <div class="home-page container-md">
        <section class="py-5 text-center container">
            <div class="row py-lg-5">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <img src="@/assets/callout.svg" alt="callout" class="w-50" />
                    <h2 class="font-weight-light">随心写作，自由表达</h2>
                    <p>
                        <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
                    </p>
                </div>
            </div>
        </section>
        <h4 class="font-weight-bold text-center">发现精彩</h4>
        <column-list :list="list"></column-list>
        <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">加载更多</button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import ColumnList, { ColumProps } from '@/components/ColumnList.vue';

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
    components: {
        ColumnList,
    },
    setup() {
        const list = computed(() => {
            return testData.map((column) => {
                if (!column.avatar) {
                    column.avatar = require('@/assets/logo.png');
                }
                return column;
            });
        });
        return { list };
    },
});
</script>

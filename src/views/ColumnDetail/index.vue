<template>
    <div class="column-detail-page w-690">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar" :alt="column.title" class="rounded-circle border w-100" />
            </div>
            <div class="col-9">
                <h4>{{ column.title }}</h4>
                <p class="text-muted">{{ column.description }}</p>
            </div>
        </div>
        <post-list :list="list"></post-list>
        <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">加载更多</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import PostList from '@/components/PostList.vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';

export default defineComponent({
    name: 'ColumnDetail',
    components: { PostList },
    setup() {
        const route = useRoute();
        const currentId = +route.params.id; //+ 字符串转换成number

        const store = useStore<GlobalDataProps>();

        const column = store.getters.getColumnById(currentId);
        const list = store.getters.getPostById(currentId);

        return { column, list };
    },
});
</script>

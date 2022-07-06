<template>
    <div class="column-detail-page w-690">
        <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
            <div class="col-3 text-center">
                <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100" />
            </div>
            <div class="col-9">
                <h4>{{ column.title }}</h4>
                <p class="text-muted">{{ column.description }}</p>
            </div>
        </div>
        <post-list :list="postList"></post-list>
        <button class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">加载更多</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PostList from '@/components/PostList.vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import { ColumnProps, PostProps } from '@/store/types';
import { generateFitUrl } from '@/helper';

export default defineComponent({
    name: 'ColumnDetail',
    components: { PostList },
    setup() {
        const route = useRoute();
        const store = useStore<GlobalDataProps>();
        const currentId = route.params.id;

        onMounted(() => {
            store.dispatch('fetchColumn', currentId);
            store.dispatch('fetchPosts', currentId);
        });

        const column = computed(() => {
            const selectColumn = store.getters.getColumnById(currentId) as ColumnProps;
            if (selectColumn) {
                generateFitUrl(selectColumn, 100, 100);
            }
            return selectColumn;
        });
        // const column = store.getters.getColumnById(currentId);
        // const list = store.getters.getPostById(currentId);
        const postList = computed(() => {
            const list = store.getters.getPostsByCid(currentId) as PostProps[];
            // list.map((item) => {
            //     if (item.image && item.image.url) {
            //         item.image.url = item.image.url + '?x-oss-process=image/resize,m_pad,h_100,w_100';
            //     } else {
            //         item.image = {
            //             url: require('@/assets/logo.png'),
            //         };
            //     }
            // });
            return list;
        });

        return { column, postList };
    },
});
</script>

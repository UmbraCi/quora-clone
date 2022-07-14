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
        <button v-if="!isLastPage" @click="loadMorePage" class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more">加载更多</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import PostList from '@/components/PostList.vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import { ColumnProps } from '@/store/types';
import { addColumnAvatar } from '@/helper';
import useLoadMore from '@/hooks/useLoadMore';

type ColumnIdProps = string | undefined;

export default defineComponent({
    name: 'ColumnDetail',
    components: { PostList },
    setup() {
        const route = useRoute();
        const store = useStore<GlobalDataProps>();
        const currentId = route.params.id as ColumnIdProps;

        const loaded = reactive({
            currentPage: 0,
            total: 0,
        });
        const total = computed(() => loaded.total);
        watch(store.state.posts.loadedColumns, () => {
            const { currentPage, total } = store.getters.getLoadedPosts(currentId);
            loaded.total = total;
            loaded.currentPage = currentPage;
        });
        const params = {
            currentPage: loaded.currentPage ? loaded.currentPage + 1 : 2,
            pageSize: 3,
            columnId: String(currentId),
        };
        const { loadMorePage, isLastPage, currentPage } = useLoadMore('fetchPosts', total, params);

        onMounted(() => {
            store.dispatch('fetchColumn', currentId);
            store.dispatch('fetchPosts', { columnId: currentId, currentId: currentId, pageSize: 3 });
        });

        const column = computed(() => {
            const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined;
            if (selectColumn) {
                addColumnAvatar(selectColumn, 100, 100);
            }
            return selectColumn;
        });
        // const column = store.getters.getColumnById(currentId);
        // const list = store.getters.getPostById(currentId);
        const postList = computed(() => {
            const list = store.getters.getPostsByCid(currentId);
            return list;
        });

        return { column, postList, loadMorePage, isLastPage, currentPage };
    },
});
</script>
<style scoped>
.load-more {
    margin-left: 50% !important;
    transform: translate3d(-50%, 0, 0);
}
</style>

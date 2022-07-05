<template>
    <div class="home-page container-md">
        <uploader action="/api/upload" :beforeUpload="beforeUpload" @file-uploaded-success="onFileUpLoadedSuccess" @file-uploaded-error="onFileUploadedError">
            <h2>点击上传</h2>
            <template #loading>
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </template>
            <template #uploaded="dataProps">
                <img :src="dataProps.uploadedData.data.url" width="500" />
            </template>
        </uploader>
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
import { computed, defineComponent, onMounted } from 'vue';
import ColumnList from '@/components/ColumnList.vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import Uploader from '@/base/Uploader.vue';
import { ResponseType, ImageProps } from '@/store/types';
import createMessage from '@/base/createMessage';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    components: {
        ColumnList,
        Uploader,
    },
    setup() {
        const store = useStore<GlobalDataProps>();
        onMounted(() => {
            store.dispatch('fetchColumns');
        });
        const list = computed(() => store.state.columns);
        // const list = computed(() => {
        //     return testData.map((column) => {
        //         if (!column.avatar) {
        //             column.avatar = require('@/assets/logo.png');
        //         }
        //         return column;
        //     });
        // });
        const beforeUpload = (file: File) => {
            const isPng = file.type === 'image/png';
            if (!isPng) {
                createMessage('请上传png格式的图片', 'error');
            }
            return isPng;
        };
        const onFileUpLoadedSuccess = (rawData: ResponseType<ImageProps>) => {
            createMessage(`上传图片的ID${rawData.data._id}`, 'success');
        };
        const onFileUploadedError = () => {
            createMessage('上传图片失败，请重新上传', 'error');
        };
        return { list, beforeUpload, onFileUpLoadedSuccess, onFileUploadedError };
    },
});
</script>

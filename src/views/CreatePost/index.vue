<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <uploader
            action="/api/upload"
            class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
            :before-upload="uploadCheck"
            :uploaded="uploadedData"
            @file-uploaded-success="onFileUploadedSuccess"
        >
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
        <!-- <input type="file" name="file" @change.prevent="handleFileChange" /> -->
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <validate-input rows="10" tag="textarea" placeholder="请输入文章详情" :rules="contentRules" v-model="contentVal" />
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large">发表文章</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import { PostProps, ResponseType, ImageProps } from '@/store/types';
import { useRouter, useRoute } from 'vue-router';
import ValidateInput, { RulesProp } from '@/base/ValidateInput.vue';
import ValidateForm from '@/base/ValidateForm.vue';
import axios from '@/libs/http';
import Uploader from '@/base/Uploader.vue';
import { beforeUploadCheck } from '@/helper';
import createMessage from '@/base/createMessage';

export default defineComponent({
    name: 'CreatePost',
    components: {
        ValidateInput,
        ValidateForm,
        Uploader,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const queryId = route.query.id;
        const idEditMode = !!queryId; //是否是编辑状态
        const titleVal = ref('');
        let imageId = '';
        const titleRules: RulesProp = [
            {
                type: 'required',
                message: '请输入文章标题',
            },
        ];
        const contentRules: RulesProp = [{ type: 'required', message: '文章详情不能为空' }];
        const contentVal = ref('');
        const store = useStore<GlobalDataProps>();
        const uploadedData = ref();
        onMounted(() => {
            if (idEditMode) {
                store.dispatch('fetchPost', queryId).then((rawData: ResponseType<PostProps>) => {
                    const currentPost = rawData.data;
                    const { image, title, content } = currentPost;
                    titleVal.value = title;
                    contentVal.value = content || '';
                    if (image) {
                        uploadedData.value = { data: image };
                    }
                });
            }
        });
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const { column, _id } = store.state.user;
                if (column) {
                    const newPost: PostProps = {
                        title: titleVal.value,
                        content: contentVal.value,
                        column,
                        author: _id,
                    };
                    if (imageId) {
                        newPost.image = imageId;
                    }
                    //提交文章
                    store.dispatch('createPost', newPost).then(() => {
                        createMessage('发表成功，2秒后跳转到文章', 'success', 2000);
                        setTimeout(() => {
                            router.push({ name: 'columnDetail', params: { id: column } });
                        }, 2000);
                    });
                }
            }
        };
        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) {
                const uploadedFile = files[0];
                const formData = new FormData();
                formData.append(uploadedFile.name, uploadedFile);
                axios
                    .post('/api/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((res) => {
                        console.log(res);
                    });
            }
        };
        const uploadCheck = (file: File) => {
            const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 });
            const { passed, error } = result;
            if (error === 'format') {
                createMessage('上传图片只能是 JPG/PNG 格式!', 'error');
            }
            if (error === 'size') {
                createMessage('上传图片大小不能超过 1Mb!', 'error');
            }
            return passed;
        };

        const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
            if (rawData.data._id) {
                imageId = rawData.data._id;
            }
        };
        return {
            onFormSubmit,
            titleVal,
            contentVal,
            titleRules,
            contentRules,
            handleFileChange,
            uploadCheck,
            onFileUploadedSuccess,
            idEditMode,
            uploadedData,
        };
    },
});
</script>

<style>
.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
    overflow: hidden;
}
.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.uploaded-area {
    position: relative;
}
.uploaded-area:hover h3 {
    display: block;
}
.uploaded-area h3 {
    display: none;
    position: absolute;
    color: #999;
    text-align: center;
    width: 100%;
    top: 50%;
}
</style>

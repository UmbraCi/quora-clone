<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <input type="file" name="file" @change.prevent="handleFileChange" />
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
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import { PostProps } from '@/store/types';
import { useRouter } from 'vue-router';
import ValidateInput, { RulesProp } from '@/base/ValidateInput.vue';
import ValidateForm from '@/base/ValidateForm.vue';
import axios from '@/libs/http';

export default defineComponent({
    name: 'CreatePost',
    components: {
        ValidateInput,
        ValidateForm,
    },
    setup() {
        const router = useRouter();
        const titleVal = ref('');
        const titleRules: RulesProp = [
            {
                type: 'required',
                message: '请输入文章标题',
            },
        ];
        const contentRules: RulesProp = [{ type: 'required', message: '文章详情不能为空' }];
        const contentVal = ref('');
        const store = useStore<GlobalDataProps>();
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const { column } = store.state.user;
                if (column) {
                    const newPost: PostProps = {
                        _id: new Date().getTime().toLocaleString(),
                        title: titleVal.value,
                        content: contentVal.value,
                        createdAt: new Date().getTime().toString(),
                        column: column,
                    };
                    //提交文章
                    store.commit('createPost', newPost);
                    router.push({ name: 'colum', params: { id: column } });
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
        return {
            onFormSubmit,
            titleVal,
            contentVal,
            titleRules,
            contentRules,
            handleFileChange,
        };
    },
});
</script>

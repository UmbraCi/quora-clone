<template>
    <div class="file-upload">
        <button class="btn btn-primary" @click.prevent="triggerUpload">
            <span v-if="fileStatus === 'loading'">正在上传...</span>
            <span v-else-if="fileStatus === 'success'">上传成功</span>
            <span v-else>点击上传</span>
        </button>
        <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from '@/libs/http';

type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
export default defineComponent({
    name: 'Uploader',
    props: {
        action: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const fileInput = ref<null | HTMLInputElement>(null);
        const fileStatus = ref<UploadStatus>('ready');
        const triggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) {
                fileStatus.value = 'loading';
                const uploadedFile = files[0];
                const formData = new FormData();
                formData.append(uploadedFile.name, uploadedFile);
                axios
                    .post(props.action, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((res) => {
                        console.log(res);
                        fileStatus.value = 'success';
                    })
                    .catch(() => {
                        fileStatus.value = 'error';
                    })
                    .finally(() => {
                        if (fileInput.value) {
                            fileInput.value.value = '';
                        }
                    });
            }
        };
        return {
            fileInput,
            triggerUpload,
            handleFileChange,
            fileStatus,
        };
    },
});
</script>

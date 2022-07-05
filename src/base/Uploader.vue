<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <button class="btn btn-primary" disabled>正在上传...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>

        <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange" />
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import axios from '@/libs/http';

type UploadStatus = 'ready' | 'loading' | 'success' | 'error';
type checkFunction = (file: File) => boolean;
export default defineComponent({
    name: 'Uploader',
    props: {
        action: {
            type: String,
            required: true,
        },
        beforeUpload: {
            type: Function as PropType<checkFunction>,
        },
    },
    emits: ['file-uploaded-success', 'file-uploaded-error'],
    setup(props, context) {
        const fileInput = ref<null | HTMLInputElement>(null);
        const fileStatus = ref<UploadStatus>('ready');
        const uploadedData = ref();
        const triggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) {
                const uploadedFile = files[0];
                if (props.beforeUpload) {
                    const result = props.beforeUpload(uploadedFile);
                    if (!result) {
                        return;
                    }
                }
                fileStatus.value = 'loading';
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
                        uploadedData.value = res.data;
                        context.emit('file-uploaded-success', res.data);
                    })
                    .catch((err) => {
                        fileStatus.value = 'error';
                        context.emit('file-uploaded-error', err);
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
            uploadedData,
        };
    },
});
</script>

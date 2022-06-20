<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="submit-area" @click.prevent="submitFrom">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import mitt from 'mitt';
type Events = {
    'form-submit': () => boolean;
    'clear-inputs': () => void;
};
type ValidateFunc = () => boolean;
type ClearFunc = () => void;
export const emitter = mitt<Events>();
export default defineComponent({
    name: 'ValidateForm',
    emits: ['form-submit'],
    setup(props, { emit }) {
        let funcArr: ValidateFunc[] = [];
        let clearFuncArr: ClearFunc[] = [];
        const submitFrom = () => {
            const result = funcArr.map((func) => func()).every((res) => res);
            emit('form-submit', result);
            //清空表单
            console.log(clearFuncArr);
            clearFuncArr.map((func) => func());
        };
        const callback = (func: ValidateFunc) => {
            funcArr.push(func);
        };
        const clearInputs = (func: ClearFunc) => {
            clearFuncArr.push(func);
        };
        emitter.on('form-submit', callback);
        emitter.on('clear-inputs', clearInputs);
        onUnmounted(() => {
            funcArr = [];
            emitter.off('form-submit', callback);
            clearFuncArr = [];
            emitter.off('clear-inputs', clearInputs);
        });
        return {
            submitFrom,
        };
    },
});
</script>

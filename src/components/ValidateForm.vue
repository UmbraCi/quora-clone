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
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'ValidateForm',
    emits: ['form-submit'],
    setup(props, { emit }) {
        const submitFrom = () => {
            emit('form-submit', true);
        };
        return {
            submitFrom,
        };
    },
});
</script>

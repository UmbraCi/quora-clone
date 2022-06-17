<template>
    <div class="validate-input-container pb-3">
        <input
            class="form-control"
            v-bind="$attrs"
            :class="{ 'is-invalid': inputRef.error }"
            :value="inputRef.val"
            @input="updateValue"
            @blur="validateInput"
        />
        <div class="form-text invalid-feedback" v-if="inputRef.error">
            {{ inputRef.message }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue';

const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
interface RuleProp {
    type: 'required' | 'email';
    message: string;
}
export type RulesProp = RuleProp[];
export default defineComponent({
    name: 'ValidateInput',
    props: {
        rules: {
            type: Array as PropType<RulesProp>,
        },
        modelValue: {
            type: String,
        },
    },
    inheritAttrs: false,
    setup(props, context) {
        const inputRef = reactive({
            val: props.modelValue || '',
            error: false,
            message: '',
        });
        const updateValue = (e: Event) => {
            const targetValue = (e.target as HTMLInputElement).value;
            inputRef.val = targetValue;
            context.emit('update:modelValue', targetValue);
        };
        const validateInput = () => {
            if (props.rules) {
                const allPassed = props.rules.every((rule) => {
                    let passed = true;
                    inputRef.message = rule.message;
                    switch (rule.type) {
                        case 'required':
                            passed = inputRef.val.trim() !== '';
                            break;
                        case 'email':
                            passed = emailReg.test(inputRef.val);
                            break;
                        default:
                            break;
                    }
                    return passed;
                });
                inputRef.error = !allPassed;
            }
        };
        return {
            inputRef,
            validateInput,
            updateValue,
        };
    },
});
</script>

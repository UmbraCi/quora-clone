<template>
    <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
            <validate-input type="text" :rules="emailRules" v-model="emailVal"></validate-input>
            <!-- <input type="email" class="form-control" v-model="emailRef.val" @blur="validateEmail" /> -->
        </div>
        <div class="mb-3">
            <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal"></validate-input>
        </div>
        <template #submit>
            <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
        </template>
    </validate-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import ValidateForm from '@/base/ValidateForm.vue';
import ValidateInput, { RulesProp } from '@/base/ValidateInput.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { GlobalDataProps } from '@/store';
import createMessage from '@/base/createMessage';

// const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
export default defineComponent({
    name: 'LoginIndex',
    components: {
        ValidateInput,
        ValidateForm,
    },
    setup() {
        const emailVal = ref('Umbraci');
        const passwordVal = ref('');
        const emailRules: RulesProp = [
            {
                type: 'required',
                message: '请输入邮箱地址',
            },
            {
                type: 'email',
                message: '请输入正确的邮箱地址',
            },
        ];
        const passwordRules: RulesProp = [
            {
                type: 'required',
                message: '请输入密码',
            },
        ];
        const emailRef = reactive({
            val: '',
            error: false,
            message: '',
        });
        // const validateEmail = () => {
        //     if (emailRef.val.trim() === '') {
        //         emailRef.error = true;
        //         emailRef.message = '邮箱地址不能为空';
        //     } else if (!emailReg.test(emailRef.val)) {
        //         emailRef.error = true;
        //         emailRef.message = '邮箱地址不正确';
        //     } else {
        //         emailRef.error = false;
        //     }
        // };
        const router = useRouter();
        const store = useStore<GlobalDataProps>();
        const onFormSubmit = (result: boolean) => {
            console.log('提交', result);
            if (result) {
                const payload = {
                    email: emailVal.value,
                    password: passwordVal.value,
                };
                store
                    .dispatch('loginAndFetch', payload)
                    .then(() => {
                        createMessage('登陆成功，2秒后跳转首页', 'success');
                        setTimeout(() => {
                            router.push('/');
                        }, 2000);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        };
        return {
            emailRef,
            // validateEmail,
            emailRules,
            passwordRules,
            emailVal,
            passwordVal,
            onFormSubmit,
        };
    },
});
</script>

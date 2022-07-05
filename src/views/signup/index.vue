<template>
    <div class="signup-page mx-auto p-3 w-330">
        <h5 class="my-4 text-center">注册者也账户</h5>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input type="text" placeholder="请输入邮箱地址" :rules="emailRules" v-model="formData.email"></validate-input>
            </div>
            <div class="mb-3">
                <label class="form-label">昵称</label>
                <validate-input type="text" placeholder="昵称" :rules="nameRules" v-model="formData.nickName"></validate-input>
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="formData.password"></validate-input>
            </div>
            <div class="mb-3">
                <label class="form-label">重复密码</label>
                <validate-input type="password" placeholder="请再次输入密码" :rules="repeatPasswordRules" v-model="formData.repeatPassword"></validate-input>
            </div>
            <template v-slot:submit>
                <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import ValidateInput, { RulesProp } from '@/base/ValidateInput.vue';
import ValidateForm from '@/base/ValidateForm.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// import Message from '@/base/Message.vue';
import createMessage from '@/base/createMessage';

export default defineComponent({
    name: 'SignupIndex',
    components: {
        ValidateForm,
        ValidateInput,
    },
    setup() {
        const formData = reactive({
            email: '',
            nickName: '',
            password: '',
            repeatPassword: '',
        });
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
        const nameRules: RulesProp = [{ type: 'required', message: '昵称不能为空' }];
        const passwordRules: RulesProp = [{ type: 'required', message: '密码不能为空' }];
        const repeatPasswordRules: RulesProp = [
            { type: 'required', message: '重复密码不能为空' },
            {
                type: 'custom',
                validator: () => {
                    return formData.password === formData.repeatPassword;
                },
                message: '两次输入的密码不一致',
            },
        ];
        const router = useRouter();
        const store = useStore();

        const onFormSubmit = (result: boolean) => {
            if (result) {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    nickName: formData.nickName,
                };
                store
                    .dispatch('register', payload)
                    .then(() => {
                        createMessage('注册成功，即将跳转到登录页', 'success');
                        setTimeout(() => {
                            router.push('/login');
                        }, 2000);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        };
        return {
            formData,
            emailRules,
            nameRules,
            passwordRules,
            repeatPasswordRules,
            onFormSubmit,
        };
    },
});
</script>

<style lang="less" scoped>
.w-330 {
    max-width: 330px;
}
.btn-block {
    width: 100%;
    display: block;
}
</style>

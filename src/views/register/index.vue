<template>
  <div class="register-container">
    <a-card class="register-card" title="新用户注册" hoverable>
      <a-form :model="formState" @finish="handleRegister">
        <a-form-item name="username" :rules="[{ required: true }]">
          <a-input v-model:value="formState.username" placeholder="用户名" />
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true }]">
          <a-input-password v-model:value="formState.password" placeholder="密码" />
        </a-form-item>
        <a-form-item name="name" :rules="[{ required: true }]">
          <a-input v-model:value="formState.name" placeholder="真实姓名" />
        </a-form-item>
        <a-button type="primary" html-type="submit" block>注 册</a-button>
      </a-form>
      <router-link to="/login" style="display:block; text-align:center; margin-top:16px;">已有账号？去登录</router-link>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const formState = reactive({ username: '', password: '', name: '' });

const handleRegister = () => {
  userStore.register(formState);
};
</script>
<style scoped>
.register-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f0f2f5; }
.register-card { width: 400px; }
</style>

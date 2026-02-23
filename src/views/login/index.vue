<template>
  <div class="login-container">
    <div class="login-left">
      <div class="content">
        <h1>FinSphere Pro</h1>
        <p>企业级金融数据可视化管理平台</p>
        <div class="features">
          <p>✅ 实时金融数据风控</p>
          <p>✅ 智能化资产配置分析</p>
          <p>✅ 完善的权限管理体系</p>
        </div>
      </div>
    </div>
    <div class="login-right">
      <div class="form-wrapper">
        <h2>账号登录</h2>
        <a-form :model="formState" @finish="handleLogin">
          <a-form-item name="username" rules="required">
            <a-input v-model:value="formState.username" size="large" placeholder="用户名">
              <template #prefix><UserOutlined class="input-icon" /></template>
            </a-input>
          </a-form-item>
          <a-form-item name="password" rules="required">
            <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
              <template #prefix><LockOutlined class="input-icon" /></template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" block :loading="loading">
              登 录
            </a-button>
          </a-form-item>
          <div class="footer-links">
            <router-link to="/register">还没有账号？立即注册</router-link>
          </div>
        </a-form>
        <div class="tips">
          <p>演示账号：admin / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const loading = ref(false);
const formState = reactive({ username: 'admin', password: '123456' });

const handleLogin = async () => {
  loading.value = true;
  try {
    await userStore.login(formState.username, formState.password);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
}
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #002140 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 40px;
}
.login-left h1 { font-size: 40px; margin-bottom: 20px; }
.login-left p { font-size: 18px; opacity: 0.8; }
.features { margin-top: 40px; line-height: 2; }

.login-right {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.form-wrapper { width: 320px; }
.form-wrapper h2 { margin-bottom: 30px; font-weight: 600; }
.input-icon { color: #bfbfbf; }
.footer-links { text-align: right; }
.tips { margin-top: 20px; text-align: center; color: #999; font-size: 12px; }
</style>

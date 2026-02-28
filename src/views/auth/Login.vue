<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElCard } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { LoginRequest } from '@/types/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 表单数据
const loginForm = ref<LoginRequest>({
  username: '',
  password: '',
  rememberMe: false
})

// 表单规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
  ]
}

const formRef = ref()

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.login(loginForm.value)
        
        // 登录成功后跳转
        const redirect = route.query.redirect as string || '/'
        router.push(redirect)
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
  })
}

// 处理回车键
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <ElCard class="login-card" shadow="always">
        <div class="login-header">
          <h1 class="login-title">FinSphere Pro</h1>
          <p class="login-subtitle">企业级金融数据管理平台</p>
        </div>
        
        <ElForm
          ref="formRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @keyup.enter="handleKeyPress"
        >
          <ElFormItem prop="username">
            <ElInput
              v-model="loginForm.username"
              placeholder="用户名"
              size="large"
              clearable
            >
              <template #prefix>
                <User class="input-icon" />
              </template>
            </ElInput>
          </ElFormItem>
          
          <ElFormItem prop="password">
            <ElInput
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
            >
              <template #prefix>
                <Lock class="input-icon" />
              </template>
            </ElInput>
          </ElFormItem>
          
          <ElFormItem>
            <ElCheckbox v-model="loginForm.rememberMe">
              记住我
            </ElCheckbox>
          </ElFormItem>
          
          <ElFormItem>
            <ElButton
              type="primary"
              size="large"
              class="login-button"
              :loading="userStore.isLoggingIn"
              @click="handleLogin"
            >
              {{ userStore.isLoggingIn ? '登录中...' : '登录' }}
            </ElButton>
          </ElFormItem>
        </ElForm>
        
        <div class="login-footer">
          <p>
            还没有账号？
            <router-link to="/register" class="register-link">
              立即注册
            </router-link>
          </p>
        </div>
      </ElCard>
    </div>
    
    <div class="login-background">
      <div class="background-overlay"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
}

.login-card {
  border-radius: 12px;
  overflow: hidden;
  
  :deep(.el-card__body) {
    padding: 40px 30px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  
  .login-title {
    font-size: 28px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 10px 0;
  }
  
  .login-subtitle {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin: 0;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
}

.input-icon {
  color: var(--el-text-color-secondary);
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 10px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  
  p {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.register-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  .background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    padding: 10px;
  }
  
  .login-card {
    :deep(.el-card__body) {
      padding: 30px 20px;
    }
  }
  
  .login-header {
    .login-title {
      font-size: 24px;
    }
  }
}
</style>
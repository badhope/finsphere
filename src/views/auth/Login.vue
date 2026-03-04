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

// 为输入框添加回车键处理
const handleInputKeyPress = (event: KeyboardEvent) => {
  handleKeyPress(event)
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
        >
          <ElFormItem prop="username">
            <ElInput
              v-model="loginForm.username"
              placeholder="用户名"
              size="large"
              clearable
              @keyup.enter="handleInputKeyPress"
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
              @keyup.enter="handleInputKeyPress"
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
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    animation: gradient-shift 15s ease infinite;
    z-index: 0;
  }
  
  @keyframes gradient-shift {
    0% {
      transform: translateX(-50%) translateY(-50%) rotate(0deg);
    }
    100% {
      transform: translateX(-50%) translateY(-50%) rotate(360deg);
    }
  }
}

.login-form-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  animation: fade-in 0.8s ease-out;
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.login-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }
  
  :deep(.el-card__body) {
    padding: 40px 30px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  
  .login-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin: 0 0 10px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: title-glow 2s ease-in-out infinite alternate;
    
    @keyframes title-glow {
      from {
        filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.5));
      }
      to {
        filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.8));
      }
    }
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
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
    }
    
    &.is-focus {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }
  
  :deep(.el-button) {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

.input-icon {
  color: var(--el-text-color-secondary);
  transition: color 0.3s ease;
  
  :deep(.el-input__wrapper:hover) & {
    color: var(--el-color-primary);
  }
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  margin-top: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6b4391 100%);
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  
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
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: var(--el-color-primary-light-3);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--el-color-primary);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
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
    background: rgba(0, 0, 0, 0.1);
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
      font-size: 28px;
    }
  }
}
</style>
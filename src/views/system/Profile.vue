<script setup lang="ts">
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElAvatar,
  ElUpload,
  ElMessage,
} from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UserInfoUpdateRequest } from '@/types/user'

const userStore = useUserStore()

const formRef = ref()
const formData = reactive<UserInfoUpdateRequest>({
  nickname: '',
  phone: '',
  avatar: '',
})

const loading = ref(false)

const formRules = {
  nickname: [{ min: 2, max: 20, message: '昵称长度应在2-20个字符之间', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
}

const loadUserInfo = () => {
  if (userStore.user) {
    formData.nickname = userStore.user.nickname || ''
    formData.phone = userStore.user.phone || ''
    formData.avatar = userStore.user.avatar || ''
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.updateUserInfo(formData)
        ElMessage.success('保存成功')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleAvatarChange = (file: File) => {
  const reader = new FileReader()
  reader.onload = e => {
    formData.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="profile">
    <ElCard class="profile-card">
      <template #header>
        <span class="card-title">个人资料</span>
      </template>

      <div class="profile-content">
        <div class="avatar-section">
          <ElAvatar :size="100" :src="formData.avatar || undefined">
            {{ userStore.user?.username?.charAt(0).toUpperCase() }}
          </ElAvatar>
          <ElUpload :show-file-list="false" :before-upload="handleAvatarChange" accept="image/*">
            <ElButton type="primary" size="small" style="margin-top: 10px">更换头像</ElButton>
          </ElUpload>
        </div>

        <ElForm
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="80px"
          style="max-width: 500px"
        >
          <ElFormItem label="用户名">
            <ElInput :value="userStore.user?.username" disabled />
          </ElFormItem>
          <ElFormItem label="邮箱">
            <ElInput :value="userStore.user?.email" disabled />
          </ElFormItem>
          <ElFormItem label="昵称" prop="nickname">
            <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
          </ElFormItem>
          <ElFormItem label="手机号" prop="phone">
            <ElInput v-model="formData.phone" placeholder="请输入手机号" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" :loading="loading" @click="handleSubmit">保存修改</ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.profile {
  padding: 20px;

  .profile-card {
    .card-title {
      font-size: 18px;
      font-weight: 600;
    }

    .profile-content {
      display: flex;
      gap: 40px;

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>

<script setup lang="ts">
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSwitch,
  ElSelect,
  ElOption,
  ElMessage,
  ElDivider,
} from 'element-plus'

import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const formRef = ref()
const loading = ref(false)

const formData = reactive({
  language: appStore.settings.language,
  timezone: appStore.settings.timezone,
  currency: appStore.settings.currency,
  dateFormat: appStore.settings.dateFormat,
  enableNotifications: appStore.settings.enableNotifications,
  autoRefreshInterval: appStore.settings.autoRefreshInterval,
})

const handleSubmit = async () => {
  loading.value = true
  try {
    appStore.updateSettings(formData)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  appStore.resetSettings()
  formData.language = appStore.settings.language
  formData.timezone = appStore.settings.timezone
  formData.currency = appStore.settings.currency
  formData.dateFormat = appStore.settings.dateFormat
  formData.enableNotifications = appStore.settings.enableNotifications
  formData.autoRefreshInterval = appStore.settings.autoRefreshInterval
  ElMessage.success('已重置为默认设置')
}
</script>

<template>
  <div class="settings">
    <ElCard class="settings-card">
      <template #header>
        <span class="card-title">系统设置</span>
      </template>

      <ElForm ref="formRef" :model="formData" label-width="120px" style="max-width: 600px">
        <ElFormItem label="界面语言">
          <ElSelect v-model="formData.language">
            <ElOption label="简体中文" value="zh-CN" />
            <ElOption label="English" value="en-US" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="时区">
          <ElSelect v-model="formData.timezone">
            <ElOption label="北京时间 (UTC+8)" value="Asia/Shanghai" />
            <ElOption label="纽约时间 (UTC-5)" value="America/New_York" />
            <ElOption label="伦敦时间 (UTC+0)" value="Europe/London" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="货币单位">
          <ElSelect v-model="formData.currency">
            <ElOption label="人民币 (CNY)" value="CNY" />
            <ElOption label="美元 (USD)" value="USD" />
            <ElOption label="欧元 (EUR)" value="EUR" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="日期格式">
          <ElSelect v-model="formData.dateFormat">
            <ElOption label="YYYY-MM-DD" value="YYYY-MM-DD" />
            <ElOption label="DD/MM/YYYY" value="DD/MM/YYYY" />
            <ElOption label="MM/DD/YYYY" value="MM/DD/YYYY" />
          </ElSelect>
        </ElFormItem>

        <ElDivider />

        <ElFormItem label="消息通知">
          <ElSwitch v-model="formData.enableNotifications" />
        </ElFormItem>

        <ElFormItem label="自动刷新间隔">
          <ElSelect v-model="formData.autoRefreshInterval">
            <ElOption label="15秒" :value="15000" />
            <ElOption label="30秒" :value="30000" />
            <ElOption label="1分钟" :value="60000" />
            <ElOption label="5分钟" :value="300000" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" :loading="loading" @click="handleSubmit">保存设置</ElButton>
          <ElButton @click="handleReset">恢复默认</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>

<style scoped lang="scss">
.settings {
  padding: 20px;

  .settings-card {
    .card-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>

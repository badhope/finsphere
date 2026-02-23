<template>
  <div class="error-page">
    <h2>404 - 页面未找到</h2>
    <a-button type="primary" @click="$router.push('/')">返回首页</a-button>
  </div>
</template>
<style scoped>
.error-page { text-align: center; padding-top: 100px; }
</style>

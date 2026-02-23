<template>
  <a-card title="用户列表">
    <template #extra>
      <a-button type="primary" @click="fetchData">刷新</a-button>
    </template>
    <a-table :dataSource="dataSource" :columns="columns" rowKey="id" />
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';

const columns = [
  { title: 'ID', dataIndex: 'id', width: 200 },
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '角色', dataIndex: 'role' },
  { title: '状态', dataIndex: 'status', customRender: ({ text }: any) => text === 1 ? '启用' : '禁用' },
];

const dataSource = ref([]);

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const res = await request({ url: '/system/users', method: 'get' });
  dataSource.value = res;
};
</script>

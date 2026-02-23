<template>
  <div class="dashboard-container">
    <!-- 数据卡片 -->
    <a-row :gutter="16" class="mb-16">
      <a-col :span="6" v-for="(item, index) in statCards" :key="index">
        <a-card>
          <a-statistic :title="item.title" :value="item.value" :precision="2" :value-style="{ color: item.color }">
            <template #prefix><component :is="item.icon" /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="资产价值走势">
          <v-chart :option="lineChartOption" style="height: 400px;" autoresize />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="资产配置比例">
          <v-chart :option="pieChartOption" style="height: 400px;" autoresize />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import request from '@/utils/request';
import { ArrowDownOutlined, ArrowUpOutlined, StockOutlined, DollarOutlined } from '@ant-design/icons-vue';

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent]);

const statCards = ref([
  { title: '总资产 (AUM)', value: 120000000, color: '#3f8600', icon: DollarOutlined },
  { title: '今日盈亏', value: 45200.50, color: '#cf1322', icon: StockOutlined },
  { title: '持仓风险度', value: 0.235, color: '#1890ff', icon: ArrowDownOutlined },
  { title: '夏普比率', value: 1.89, color: '#722ed1', icon: ArrowUpOutlined },
]);

const lineChartOption = ref({});
const pieChartOption = ref({});

onMounted(async () => {
  // 获取 Mock 数据
  const res = await request({ url: '/dashboard/market', method: 'get' });
  
  // 生成折线图配置
  lineChartOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: res.kline.map((i: any) => i.date) },
    yAxis: { type: 'value' },
    series: [{ data: res.kline.map((i: any) => i.value), type: 'line', smooth: true, areaStyle: {} }]
  };

  // 生成饼图配置
  pieChartOption.value = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      name: '资产配置',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
      labelLine: { show: false },
      data: res.assets
    }]
  };
});
</script>

<style scoped>
.dashboard-container {
  padding: 0; /* layout has margin */
}
.mb-16 { margin-bottom: 16px; }
</style>

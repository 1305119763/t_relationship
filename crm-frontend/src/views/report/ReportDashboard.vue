<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getSalesFunnel, getSalesTrend, getCustomerStats } from '@/api/report'

const funnelRef = ref<HTMLDivElement | null>(null)
const trendRef = ref<HTMLDivElement | null>(null)
const stats = ref({ total: 0, new: 0, active: 0 })

const initFunnel = (data: any[]) => {
  if (!funnelRef.value) return
  const chart = echarts.init(funnelRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Sales Funnel',
        type: 'funnel',
        data
      }
    ]
  })
}

const initTrend = (data: any[]) => {
  if (!trendRef.value) return
  const chart = echarts.init(trendRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map(d => d.month) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Amount',
        type: 'line',
        smooth: true,
        data: data.map(d => d.amount)
      }
    ]
  })
}

onMounted(async () => {
  const [funnel, trend, cs] = await Promise.all([
    getSalesFunnel(),
    getSalesTrend(),
    getCustomerStats()
  ]) as any
  initFunnel(funnel)
  initTrend(trend)
  stats.value = cs
})
</script>

<template>
  <div class="app-container">
    <div class="cards">
      <el-card class="card">
        <div class="stat">
          <div class="value">{{ stats.total }}</div>
          <div class="label">客户数</div>
        </div>
      </el-card>
      <el-card class="card">
        <div class="stat">
          <div class="value">{{ stats.new }}</div>
          <div class="label">新增</div>
        </div>
      </el-card>
      <el-card class="card">
        <div class="stat">
          <div class="value">{{ stats.active }}</div>
          <div class="label">活跃</div>
        </div>
      </el-card>
    </div>

    <el-card>
      <template #header>销售漏斗</template>
      <div ref="funnelRef" class="chart"></div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <template #header>销售趋势（近6个月）</template>
      <div ref="trendRef" class="chart"></div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.app-container {
  padding: 20px;
}
.cards {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.card {
  flex: 1;
}
.stat {
  text-align: center;
}
.value {
  font-size: 24px;
  font-weight: bold;
}
.label {
  color: #999;
}
.chart {
  width: 100%;
  height: 320px;
}
</style>

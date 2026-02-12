<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getCustomerStats, getSalesFunnel } from '@/api/report'
import { User, Link, DataLine, Document, Message, Finished, Wallet, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import CreateTaskDialog from '@/components/CreateTaskDialog.vue'
import CreateWorkOrderDialog from '@/components/CreateWorkOrderDialog.vue'
import CreateWorkReportDialog from '@/components/CreateWorkReportDialog.vue'
import CreateScheduleDialog from '@/components/CreateScheduleDialog.vue'
import CreateAnnouncementDialog from '@/components/CreateAnnouncementDialog.vue'

const actions = reactive([
  { icon: User, label: '新建客户', action: () => {} },
  { icon: Link, label: '新增线索', action: () => {} },
  { icon: DataLine, label: '新增商机', action: () => {} },
  { icon: Document, label: '新建订单', action: () => {} },
  { icon: Message, label: '写跟进进度', action: () => {} },
  { icon: Finished, label: '新建任务', action: () => taskDialogVisible.value = true },
  { icon: Wallet, label: '创建工单', action: () => workOrderDialogVisible.value = true },
  { icon: Wallet, label: '新建回款单', action: () => {} },
  { icon: Calendar, label: '回访计划', action: () => scheduleDialogVisible.value = true }
])

const dataTiles = reactive([
  { label: '新增客户', value: 200 },
  { label: '新增线索', value: 200 },
  { label: '新增商机', value: 200 },
  { label: '新增订单', value: 200 },
  { label: '新增联系人', value: 200 },
  { label: '跟进次数', value: 200 },
  { label: '新增工单', value: 200 },
  { label: '处理任务', value: 200 },
  { label: '处理工单', value: 200 }
])

const notices = reactive([
  { title: '如何建立良好的客户关系', time: '2019-04-10 09:00' },
  { title: '如何建立良好的客户关系', time: '2019-04-10 09:00' },
  { title: '如何建立良好的客户关系', time: '2019-04-10 09:00' },
  { title: '如何建立良好的客户关系', time: '2019-04-10 09:00' },
  { title: '如何建立良好的客户关系', time: '2019-04-10 09:00' }
])

const stats = ref({ total: 0, new: 0, active: 0 })

const goalChartRef = ref<HTMLDivElement | null>(null)
const rankingChartRef = ref<HTMLDivElement | null>(null)
const forecastChartRef = ref<HTMLDivElement | null>(null)
const funnelChartRef = ref<HTMLDivElement | null>(null)

const forecastType = ref('公司数据')
const rankingType = ref('个人排行')

const calendarDate = ref(new Date())

// 弹窗状态
const taskDialogVisible = ref(false)
const workOrderDialogVisible = ref(false)
const workReportDialogVisible = ref(false)
const scheduleDialogVisible = ref(false)
const announcementDialogVisible = ref(false)

// 处理弹窗回调
const handleTaskCreated = () => {
  ElMessage.success('任务创建成功')
}

const handleWorkOrderCreated = () => {
  ElMessage.success('工单创建成功')
}

const handleWorkReportCreated = () => {
  ElMessage.success('工作报告创建成功')
}

const handleScheduleCreated = () => {
  ElMessage.success('日程创建成功')
}

const handleAnnouncementCreated = () => {
  ElMessage.success('公告发布成功')
}

const initGoalChart = (completed: number, target: number) => {
  if (!goalChartRef.value) return
  const chart = echarts.init(goalChartRef.value)
  const percent = Math.round((completed / target) * 100)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: completed, name: '完成金额', itemStyle: { color: '#409EFF' } },
          { value: target - completed, name: '剩余金额', itemStyle: { color: '#E5EAF3' } }
        ]
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '43%',
        style: { text: percent + '%', textAlign: 'center', fill: '#303133', fontSize: 22, fontWeight: 600 }
      },
      {
        type: 'text',
        left: 'center',
        top: '56%',
        style: { text: '完成度', textAlign: 'center', fill: '#909399', fontSize: 14 }
      }
    ]
  })
}

const initRankingChart = () => {
  if (!rankingChartRef.value) return
  const chart = echarts.init(rankingChartRef.value)
  const names = ['张三','李四','王五','小明','小李','小木','阿三','老公','小黑']
  const targetData = [120000, 250000, 140000, 180000, 160000, 130000, 200000, 190000, 210000]
  const achievedData = [90000, 220000, 110000, 150000, 120000, 90000, 170000, 150000, 180000]
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['目标金额','成交金额'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: names },
    yAxis: { type: 'value' },
    series: [
      { name: '目标金额', type: 'bar', data: targetData, itemStyle: { color: '#409EFF' } },
      { name: '成交金额', type: 'bar', data: achievedData, itemStyle: { color: '#F59A23' } }
    ]
  })
}

const initForecastChart = () => {
  if (!forecastChartRef.value) return
  const chart = echarts.init(forecastChartRef.value)
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
  const planData = [80000, 240000, 120000, 130000, 140000, 160000, 170000, 180000, 150000, 160000, 170000, 190000]
  const expectData = [60000, 200000, 90000, 110000, 100000, 120000, 140000, 150000, 120000, 130000, 140000, 160000]
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['预计销售额','潜客金额'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '预计销售额', type: 'bar', data: planData, itemStyle: { color: '#409EFF' } },
      { name: '潜客金额', type: 'bar', data: expectData, itemStyle: { color: '#FF6B6B' } }
    ]
  })
}

const initFunnelChart = (data: any[]) => {
  if (!funnelChartRef.value) return
  const chart = echarts.init(funnelChartRef.value)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { show: false },
    series: [
      {
        type: 'funnel',
        left: '10%',
        width: '80%',
        label: { position: 'inside' },
        data
      }
    ]
  })
}

onMounted(async () => {
  const [funnel, cs] = await Promise.all([
    getSalesFunnel(),
    getCustomerStats()
  ]) as any
  stats.value = cs
  initGoalChart(400000, 1000000)
  initRankingChart()
  initForecastChart()
  const funnelData = Array.isArray(funnel) && funnel.length
    ? funnel.map((i: any) => ({ name: i.name, value: i.value }))
    : [
        { name: '初步谈谈', value: 120 },
        { name: '深入沟通', value: 100 },
        { name: '产品报价', value: 80 },
        { name: '成交上线', value: 50 },
        { name: '流失商机', value: 20 }
      ]
  initFunnelChart(funnelData)
})
</script>

<template>
  <div class="dashboard">
    <el-card class="block">
      <template #header>快捷新建</template>
      <div class="quick">
        <div v-for="a in actions" :key="a.label" class="quick-item" @click="a.action">
          <el-icon class="quick-icon"><component :is="a.icon" /></el-icon>
          <div class="quick-label">{{ a.label }}</div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" class="block">
      <el-col :span="16">
        <el-card>
          <template #header>数据快报</template>
          <div class="tiles">
            <el-card v-for="t in dataTiles" :key="t.label" class="tile">
              <div class="tile-value">{{ t.value }}</div>
              <div class="tile-label">{{ t.label }}</div>
            </el-card>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
              <div class="header-actions">
                <el-button size="small" type="primary" @click="announcementDialogVisible = true">发布公告</el-button>
                <el-button size="small">查看更多</el-button>
              </div>
            </div>
          </template>
          <el-scrollbar height="270px">
            <div class="notice" v-for="n in notices" :key="n.time">
              <div class="notice-title">[内部分享] {{ n.title }}</div>
              <div class="notice-time">{{ n.time }}</div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="block">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>业绩目标</span>
              <div class="header-actions">
                <el-select v-model="rankingType" size="small" style="width: 110px">
                  <el-option label="公司目标" value="公司目标" />
                </el-select>
                <el-date-picker v-model="calendarDate" type="month" size="small" style="width: 120px" />
              </div>
            </div>
          </template>
          <div class="goal-wrapper">
            <div ref="goalChartRef" class="chart"></div>
            <div class="goal-info">
              <div>目标金额</div>
              <div class="money">¥ 1,000,000.00</div>
              <div>完成金额</div>
              <div class="money primary">¥ 400,000.00</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>业绩排行</span>
              <div class="header-actions">
                <el-select v-model="rankingType" size="small" style="width: 110px">
                  <el-option label="个人排行" value="个人排行" />
                </el-select>
                <el-date-picker v-model="calendarDate" type="month" size="small" style="width: 120px" />
              </div>
            </div>
          </template>
          <div ref="rankingChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="block">
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售预测</span>
              <div class="header-actions">
                <el-select v-model="forecastType" size="small" style="width: 110px">
                  <el-option label="公司数据" value="公司数据" />
                </el-select>
              </div>
            </div>
          </template>
          <div ref="forecastChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售漏斗</span>
              <div class="header-actions">
                <el-select v-model="forecastType" size="small" style="width: 110px">
                  <el-option label="公司数据" value="公司数据" />
                </el-select>
                <el-date-picker v-model="calendarDate" type="month" size="small" style="width: 120px" />
              </div>
            </div>
          </template>
          <div ref="funnelChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="block">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>工作报告</span>
              <div class="header-actions">
                <el-select size="small" style="width: 120px" model-value="提交给我的">
                  <el-option label="提交给我的" value="提交给我的" />
                </el-select>
                <el-button size="small" @click="workReportDialogVisible = true">添加</el-button>
                <el-button size="small">查看更多</el-button>
              </div>
            </div>
          </template>
          <el-scrollbar height="320px">
            <div class="report-item" v-for="i in 8" :key="i">
              <div class="report-left">
                <el-avatar src="https://avatars.githubusercontent.com/u/1" size="small" />
                <div class="report-title">2025-12-31 工作报告</div>
                <div class="report-author">柿子</div>
              </div>
              <div class="report-status">未批阅</div>
              <el-link type="primary">详情</el-link>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>日程日历</span>
              <div class="header-actions">
                <el-select size="small" style="width: 120px" model-value="提交给我的">
                  <el-option label="提交给我的" value="提交给我的" />
                </el-select>
                <el-button size="small" type="primary" @click="scheduleDialogVisible = true">新建日程</el-button>
                <el-button size="small">日程管理</el-button>
              </div>
            </div>
          </template>
          <div class="calendar-bar">
            <el-date-picker v-model="calendarDate" type="year" size="small" style="width: 110px" />
            <el-date-picker v-model="calendarDate" type="month" size="small" style="width: 110px" />
          </div>
          <el-calendar v-model="calendarDate" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗组件 -->
    <CreateTaskDialog v-model:visible="taskDialogVisible" @task-created="handleTaskCreated" />
    <CreateWorkOrderDialog v-model:visible="workOrderDialogVisible" @work-order-created="handleWorkOrderCreated" />
    <CreateWorkReportDialog v-model:visible="workReportDialogVisible" @report-created="handleWorkReportCreated" />
    <CreateScheduleDialog v-model:visible="scheduleDialogVisible" @schedule-created="handleScheduleCreated" />
    <CreateAnnouncementDialog v-model:visible="announcementDialogVisible" @announcement-created="handleAnnouncementCreated" />
  </div>
</template>

<style scoped lang="less">
.dashboard {
  padding: 16px;
}
.block {
  margin-bottom: 16px;
}
.quick {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 12px;
}
.quick-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 88px;
  border-radius: 8px;
  background: #f8f9fb;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #e6f2ff;
    transform: translateY(-2px);
  }
}
.quick-icon {
  font-size: 22px;
  color: #409eff;
}
.quick-label {
  margin-top: 6px;
  font-size: 14px;
  color: #606266;
}
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tile {
  text-align: center;
}
.tile-value {
  font-size: 20px;
  font-weight: 600;
}
.tile-label {
  color: #909399;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 6px;
  border-bottom: 1px solid #f0f2f5;
}
.notice-title {
  color: #606266;
}
.notice-time {
  color: #c0c4cc;
}
.goal-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chart {
  width: 100%;
  height: 300px;
}
.goal-info {
  width: 200px;
}
.money {
  font-size: 16px;
  margin-bottom: 8px;
}
.money.primary {
  color: #409eff;
}
.report-item {
  display: grid;
  grid-template-columns: 1fr 100px 60px;
  gap: 8px;
  align-items: center;
  padding: 10px 6px;
  border-bottom: 1px solid #f0f2f5;
}
.report-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.report-title {
  font-weight: 500;
}
.report-author {
  color: #909399;
}
.report-status {
  color: #f59a23;
}
.calendar-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
</style>

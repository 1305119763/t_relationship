<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createSchedule } from '@/api/schedule'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'scheduleCreated'): void
}>()

const form = reactive({
  title: '',
  startTime: '',
  endTime: '',
  urgency: 1,
  businessType: '',
  businessValue: '',
  description: '',
  status: 'in_progress',
  autoEnd: '1',
  taskTag: 'red',
  reminder: 'on_time'
})

const rules = {
  title: [{ required: true, message: '请输入日程标题', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const formRef = ref()

const handleCancel = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await createSchedule({
          title: form.title,
          startTime: form.startTime,
          endTime: form.endTime,
          urgency: form.urgency,
          businessType: form.businessType,
          businessValue: form.businessValue,
          description: form.description,
          status: form.status,
          autoEnd: form.autoEnd,
          taskTag: form.taskTag,
          reminder: form.reminder
        })
        ElMessage.success('日程创建成功')
        emit('scheduleCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('创建日程失败:', error)
        ElMessage.error('创建日程失败')
      }
    }
  })
}

const tagColors = [
  { color: '#ff4d4f', value: 'red' },
  { color: '#ffa940', value: 'orange' },
  { color: '#52c41a', value: 'green' },
  { color: '#1890ff', value: 'blue' },
  { color: '#722ed1', value: 'purple' },
  { color: '#333333', value: 'black' }
]
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="新建日程" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="日程标题" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入任务标题" />
      </el-form-item>
      
      <el-form-item label="开始时间" prop="startTime" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="结束时间" prop="endTime" required>
        <el-date-picker
          v-model="form.endTime"
          type="datetime"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="紧急程度">
        <el-radio-group v-model="form.urgency">
          <el-radio :label="1">重要</el-radio>
          <el-radio :label="2">紧急</el-radio>
          <el-radio :label="3">普通</el-radio>
          <el-radio :label="4">重要且紧急</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="关联业务">
        <el-select v-model="form.businessType" placeholder="选择业务类型" style="width: 150px; margin-right: 10px;">
          <el-option label="客户" value="customer" />
          <el-option label="订单" value="order" />
          <el-option label="商机" value="opportunity" />
        </el-select>
        <el-select v-model="form.businessValue" placeholder="请选择" style="width: 200px;">
          <el-option label="请选择" value="" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="日程描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="300"
          show-word-limit
          placeholder="描述备注信息"
        />
      </el-form-item>
      
      <el-form-item label="日程状态">
        <el-radio-group v-model="form.status">
          <el-radio label="in_progress">执行中</el-radio>
          <el-radio label="completed">已结束</el-radio>
          <el-radio label="cancelled">已取消</el-radio>
        </el-radio-group>
        <el-checkbox v-model="form.autoEnd" true-label="1" false-label="0" style="margin-left: 20px;">过期自动结束</el-checkbox>
      </el-form-item>
      
      <el-form-item label="任务标记">
        <div class="tag-colors">
          <div
            v-for="tag in tagColors"
            :key="tag.value"
            class="color-circle"
            :style="{ backgroundColor: tag.color }"
            :class="{ active: form.taskTag === tag.value }"
            @click="form.taskTag = tag.value"
          />
        </div>
      </el-form-item>
      
      <el-form-item label="处理提醒">
        <el-select v-model="form.reminder" placeholder="准时提醒" style="width: 100%;">
          <el-option label="准时提醒" value="on_time" />
          <el-option label="提前5分钟" value="5min" />
          <el-option label="提前15分钟" value="15min" />
          <el-option label="提前30分钟" value="30min" />
          <el-option label="提前1小时" value="1hour" />
        </el-select>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.tag-colors {
  display: flex;
  gap: 12px;
  align-items: center;
  
  .color-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.active {
      border-color: #fff;
      box-shadow: 0 0 0 2px #409eff;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

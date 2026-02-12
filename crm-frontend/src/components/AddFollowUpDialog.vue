<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, User, Phone } from '@element-plus/icons-vue'
import { createFollowUp } from '@/api/customer'

const props = defineProps<{
  visible: boolean
  customerId?: number
  customerName?: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'followUpCreated'): void
}>()

const form = reactive({
  type: '',
  content: '',
  customerId: props.customerId || 0,
  customerName: props.customerName || '',
  customerStatus: '',
  contact: '',
  nextTasks: [] as string[],
  createNextTask: false,
  followUpTime: ''
})

const rules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
  customerStatus: [{ required: true, message: '请选择客户状态', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  followUpTime: [{ required: true, message: '请选择跟进时间', trigger: 'change' }]
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
        // 调用API来创建跟进记录
        await createFollowUp({
          type: form.type,
          content: form.content,
          customerId: form.customerId,
          contact: form.contact,
          customerStatus: form.customerStatus,
          createNextTask: form.createNextTask,
          followUpTime: form.followUpTime
        })
        ElMessage.success('跟进记录创建成功')
        emit('followUpCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('创建跟进记录失败:', error)
        ElMessage.error('创建跟进记录失败')
      }
    }
  })
}

const addNextTask = () => {
  form.nextTasks.push('')
}

const removeNextTask = (index: number) => {
  form.nextTasks.splice(index, 1)
}
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="添加跟进" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="选择类型" prop="type">
        <el-select v-model="form.type" placeholder="选择类型">
          <el-option label="电话" value="phone" />
          <el-option label="邮件" value="email" />
          <el-option label="拜访" value="visit" />
          <el-option label="会议" value="meeting" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="选择范围">
        <el-button type="text">选择范围</el-button>
      </el-form-item>
      
      <el-form-item label="请输入跟进内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          rows="4"
          maxlength="300"
          show-word-limit
          placeholder="请输入跟进内容"
        />
        <div class="editor-tools">
          <el-button size="small" type="text">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </el-button>
          <el-button size="small" type="text">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </el-button>
        </div>
      </el-form-item>
      
      <el-form-item label="客户名称" prop="customerName">
        <el-select v-model="form.customerName" placeholder="选择客户">
          <el-option :label="form.customerName" :value="form.customerName" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="客户状态" prop="customerStatus">
        <el-select v-model="form.customerStatus" placeholder="选择状态">
          <el-option label="新建" value="new" />
          <el-option label="潜在" value="potential" />
          <el-option label="活跃" value="active" />
          <el-option label="流失" value="lost" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="联系人" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系人">
          <template #prefix><User /></template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="提醒查看">
        <el-tag v-for="(task, index) in form.nextTasks" :key="index" closable @close="removeNextTask(index)">
          {{ task }}
        </el-tag>
        <el-button type="text" size="small" @click="addNextTask">添加</el-button>
      </el-form-item>
      
      <el-form-item>
        <el-checkbox v-model="form.createNextTask">创建下次跟进任务</el-checkbox>
      </el-form-item>
      
      <el-form-item label="跟进时间" prop="followUpTime">
        <el-date-picker
          v-model="form.followUpTime"
          type="datetime"
          placeholder="选择时间"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.editor-tools {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
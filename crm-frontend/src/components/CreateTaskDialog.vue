<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { createTask } from '@/api/task'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'taskCreated'): void
}>()

const form = reactive({
  title: '',
  startTime: '',
  endTime: '',
  priority: 1,
  businessType: 'customer',
  businessValue: '',
  description: '',
  attachment: '',
  responsiblePerson: '包子'
})

const rules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  responsiblePerson: [{ required: true, message: '请选择负责人员', trigger: 'change' }]
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
        await createTask({
          title: form.title,
          startTime: form.startTime,
          endTime: form.endTime,
          priority: form.priority,
          businessType: form.businessType,
          businessValue: form.businessValue,
          description: form.description,
          attachment: form.attachment,
          responsiblePerson: form.responsiblePerson
        })
        ElMessage.success('任务创建成功')
        emit('taskCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('创建任务失败:', error)
        ElMessage.error('创建任务失败')
      }
    }
  })
}
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="新建任务" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="任务标题" prop="title" required>
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
      
      <el-form-item label="重要程度">
        <el-radio-group v-model="form.priority">
          <el-radio :label="1">重要</el-radio>
          <el-radio :label="2">紧急</el-radio>
          <el-radio :label="3">普通</el-radio>
          <el-radio :label="4">重要且紧急</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="关联业务">
        <el-select v-model="form.businessType" placeholder="客户" style="width: 120px; margin-right: 10px;">
          <el-option label="客户" value="customer" />
          <el-option label="订单" value="order" />
          <el-option label="商机" value="opportunity" />
        </el-select>
        <el-select v-model="form.businessValue" placeholder="请选择" style="width: 200px;">
          <el-option label="请选择" value="" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="任务描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          maxlength="300"
          show-word-limit
          placeholder="请输入备注信息"
        />
      </el-form-item>
      
      <el-form-item label="选择附件" required>
        <el-button type="default">选择附件</el-button>
        <div class="attachment-tip">支持格式：.rar .zip .doc .docx .pdf，单个文件不能超过20MB</div>
      </el-form-item>
      
      <el-form-item label="负责人员" prop="responsiblePerson" required>
        <el-input v-model="form.responsiblePerson" placeholder="包子">
          <template #suffix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
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
.attachment-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

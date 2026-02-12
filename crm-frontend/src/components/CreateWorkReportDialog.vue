<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Plus } from '@element-plus/icons-vue'
import { createWorkReport } from '@/api/workReport'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'reportCreated'): void
}>()

const form = reactive({
  reportType: '',
  reportDate: '2019-04-22',
  workSummary: '',
  fileAttachment: '',
  imageUpload: '',
  approver: '包子',
  ccMembers: ['张三', '柠檬', '柿子'] as string[]
})

const rules = {
  reportType: [{ required: true, message: '请选择报告类型', trigger: 'change' }],
  workSummary: [{ required: true, message: '请输入工作总结', trigger: 'blur' }],
  approver: [{ required: true, message: '请选择批阅人员', trigger: 'change' }]
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
        await createWorkReport({
          reportType: form.reportType,
          reportDate: form.reportDate,
          workSummary: form.workSummary,
          fileAttachment: form.fileAttachment,
          imageUpload: form.imageUpload,
          approver: form.approver,
          ccMembers: form.ccMembers
        })
        ElMessage.success('工作报告创建成功')
        emit('reportCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('创建工作报告失败:', error)
        ElMessage.error('创建工作报告失败')
      }
    }
  })
}

const removeCcMember = (index: number) => {
  form.ccMembers.splice(index, 1)
}

const addCcMember = () => {
  form.ccMembers.push('新成员')
}
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="添加工作报告" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="报告类型" prop="reportType" required>
        <el-select v-model="form.reportType" placeholder="请选择" style="width: 200px; margin-right: 10px;">
          <el-option label="日报" value="daily" />
          <el-option label="周报" value="weekly" />
          <el-option label="月报" value="monthly" />
        </el-select>
        <el-date-picker v-model="form.reportDate" type="date" placeholder="选择日期" />
      </el-form-item>
      
      <el-form-item label="工作总结" prop="workSummary" required>
        <el-input
          v-model="form.workSummary"
          type="textarea"
          :rows="6"
          maxlength="1000"
          show-word-limit
          placeholder="请输入工作总结"
        />
      </el-form-item>
      
      <el-form-item label="文件上传">
        <el-button type="default">选择附件</el-button>
        <div class="upload-tip">支持格式：.rar .zip .doc .docx .pdf，单个文件不能超过20MB</div>
      </el-form-item>
      
      <el-form-item label="图片上传">
        <el-upload
          class="avatar-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
        >
          <div class="upload-box">
            <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
            <div class="upload-text">上传图片</div>
          </div>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="批阅人员" prop="approver" required>
        <el-input v-model="form.approver" placeholder="包子">
          <template #suffix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="抄送成员">
        <div class="cc-members">
          <el-tag
            v-for="(member, index) in form.ccMembers"
            :key="index"
            closable
            @close="removeCcMember(index)"
            class="member-tag"
          >
            {{ member }}
          </el-tag>
          <el-button type="primary" size="small" @click="addCcMember">
            <el-icon><Plus /></el-icon>
            选择
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.upload-box {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    border-color: #409eff;
  }
  
  .upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
}

.cc-members {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  
  .member-tag {
    margin-right: 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

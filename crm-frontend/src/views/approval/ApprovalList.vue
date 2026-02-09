<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getRequests, approveRequest, rejectRequest, getTemplates, createRequest } from '@/api/approval'
import { ElMessage } from 'element-plus'
import { Check, Close, Plus } from '@element-plus/icons-vue'

interface ApprovalRequest {
  id: number
  template: {
    name: string
  }
  applicant: {
    name: string
  }
  status: string
  currentStep: number
  createdAt: string
  data: string
}

const activeTab = ref('requests')
const requests = ref<ApprovalRequest[]>([])
const templates = ref<any[]>([])
const loading = ref(false)
const createDialogVisible = ref(false)
const createForm = reactive({
  templateId: null,
  data: {} as any
})

const fetchRequests = async () => {
  loading.value = true
  try {
    const res: any = await getRequests()
    requests.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const fetchTemplates = async () => {
  try {
    const res: any = await getTemplates()
    templates.value = res
  } catch (error) {
    console.error(error)
  }
}

const actionDialogVisible = ref(false)
const actionType = ref<'approve' | 'reject'>('approve')
const selectedRow = ref<ApprovalRequest | null>(null)
const actionComment = ref('')

const openAction = (row: ApprovalRequest, type: 'approve' | 'reject') => {
  selectedRow.value = row
  actionType.value = type
  actionComment.value = ''
  actionDialogVisible.value = true
}

const submitAction = async () => {
  if (!selectedRow.value) return
  try {
    if (actionType.value === 'approve') {
      await approveRequest(selectedRow.value.id, { comment: actionComment.value })
      ElMessage.success('已通过')
      selectedRow.value.status = 'approved'
    } else {
      await rejectRequest(selectedRow.value.id, { comment: actionComment.value })
      ElMessage.success('已驳回')
      selectedRow.value.status = 'rejected'
    }
    actionDialogVisible.value = false
    fetchRequests()
  } catch (error) {
    console.error(error)
  }
}

const handleCreate = () => {
  createDialogVisible.value = true
  fetchTemplates()
}

const submitCreate = async () => {
  if (!createForm.templateId) {
    ElMessage.warning('请选择模板')
    return
  }
  try {
    await createRequest(createForm)
    ElMessage.success('创建成功')
    createDialogVisible.value = false
    fetchRequests()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

<template>
  <div class="app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="我的审批" name="requests">
        <div class="filter-container">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建申请</el-button>
        </div>
        
        <el-table v-loading="loading" :data="requests" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="template.name" label="类型" />
          <el-table-column prop="applicant.name" label="申请人" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'">
                {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已驳回' : '待审批' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'pending'"
                type="success" 
                size="small" 
                :icon="Check" 
                @click="openAction(row, 'approve')"
              >通过</el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="danger" 
                size="small" 
                :icon="Close" 
                @click="openAction(row, 'reject')"
              >驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="流程设计" name="design">
        <div style="padding: 20px; text-align: center; color: #999;">
          流程设计器占位（可视化流程编辑器）
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog 
      v-model="actionDialogVisible" 
      :title="actionType === 'approve' ? '通过审批' : '驳回审批'" 
      width="520px"
      class="action-dialog"
      center
    >
      <el-form label-width="100px">
        <el-form-item label="备注">
          <el-input 
            v-model="actionComment" 
            type="textarea" 
            :rows="4" 
            placeholder="请输入备注说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="actionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAction">{{ actionType === 'approve' ? '通过' : '驳回' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="createDialogVisible" title="新建申请" width="500px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="模板">
          <el-select v-model="createForm.templateId" placeholder="选择模板">
            <el-option 
              v-for="item in templates" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="事由">
           <el-input v-model="createForm.data.reason" type="textarea" />
        </el-form-item>
        <el-form-item label="金额">
           <el-input-number v-model="createForm.data.amount" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCreate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.app-container {
  padding: 20px;
  
  .filter-container {
    margin-bottom: 20px;
  }
}
.action-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
}
.action-dialog :deep(.el-dialog__header) {
  font-weight: 600;
}
</style>

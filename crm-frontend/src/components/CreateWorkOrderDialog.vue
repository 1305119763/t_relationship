<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createWorkOrder } from '@/api/workOrder'
import { getCustomers } from '@/api/customer'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'workOrderCreated'): void
}>()

const customerList = ref<{ id: number; name: string }[]>([])

const form = reactive({
  customer: '' as number | '',
  order: '',
  type: '',
  title: '',
  content: '',
  status: '',
  mobileAttendance: '1',
  signInAddress: '深圳市南山区科苑路15号',
  signInRange: ''
})

watch(() => props.visible, (visible) => {
  if (visible) {
    getCustomers().then((res: any) => {
      customerList.value = Array.isArray(res) ? res : (res?.data ?? [])
    }).catch(() => {
      customerList.value = []
    })
  }
})

const rules = {
  customer: [{ required: true, message: '请选择关联客户', trigger: 'change' }],
  type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
  title: [{ required: true, message: '请填写工单标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入工单内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择紧急状态', trigger: 'change' }],
  signInAddress: [{ required: true, message: '请选择签到地址', trigger: 'blur' }],
  signInRange: [{ required: true, message: '请输入签到范围', trigger: 'blur' }]
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
        await createWorkOrder({
          customerId: Number(form.customer),
          orderId: form.order || undefined,
          type: form.type,
          title: form.title,
          content: form.content,
          status: form.status,
          mobileAttendance: form.mobileAttendance,
          signInAddress: form.signInAddress,
          signInRange: form.signInRange
        })
        ElMessage.success('工单创建成功')
        emit('workOrderCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('创建工单失败:', error)
        ElMessage.error('创建工单失败')
      }
    }
  })
}
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="发起工单" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="关联客户" prop="customer" required>
        <el-select v-model="form.customer" placeholder="选择客户" style="width: 100%;">
          <el-option
            v-for="c in customerList"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="关联订单">
        <el-select v-model="form.order" placeholder="选择订单" style="width: 100%;">
          <el-option label="订单1" value="order1" />
          <el-option label="订单2" value="order2" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="工单类型" prop="type" required>
        <el-select v-model="form.type" placeholder="选择类型" style="width: 100%;">
          <el-option label="维修" value="repair" />
          <el-option label="安装" value="install" />
          <el-option label="咨询" value="consult" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="工单标题" prop="title" required>
        <el-input v-model="form.title" placeholder="填写标题" />
      </el-form-item>
      
      <el-form-item label="工单内容" prop="content" required>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="4"
          maxlength="300"
          show-word-limit
          placeholder="请输入请假原因"
        />
      </el-form-item>
      
      <el-form-item label="紧急状态" prop="status" required>
        <el-select v-model="form.status" placeholder="选择状态" style="width: 100%;">
          <el-option label="普通" value="normal" />
          <el-option label="紧急" value="urgent" />
          <el-option label="非常紧急" value="very_urgent" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="移动考勤">
        <el-checkbox v-model="form.mobileAttendance" true-label="1" false-label="0">执行人须到指定地点签到</el-checkbox>
      </el-form-item>
      
      <el-form-item label="签到地址" prop="signInAddress" required>
        <el-input v-model="form.signInAddress" placeholder="请输入签到地址">
          <template #append>
            <el-button type="primary">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="签到范围" prop="signInRange" required>
        <el-input v-model="form.signInRange" placeholder="输入数值">
          <template #append>米</template>
        </el-input>
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

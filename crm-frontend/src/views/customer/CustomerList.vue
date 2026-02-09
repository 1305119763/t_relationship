<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/api/customer'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

interface Customer {
  id: number
  name: string
  industry: string
  status: string
  owner: {
    name: string
  }
}

const tableData = ref<Customer[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增客户')
const formRef = ref()

const form = reactive({
  id: 0,
  name: '',
  industry: '',
  status: 'new'
})

const rules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请输入行业', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getCustomers()
    tableData.value = res
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增客户'
  form.id = 0
  form.name = ''
  form.industry = ''
  form.status = 'new'
  dialogVisible.value = true
}

const handleEdit = (row: Customer) => {
  dialogTitle.value = '编辑客户'
  form.id = row.id
  form.name = row.name
  form.industry = row.industry
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row: Customer) => {
  ElMessageBox.confirm('确认删除该客户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCustomer(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error(error)
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.id) {
          await updateCustomer(form.id, form)
          ElMessage.success('更新成功')
        } else {
          await createCustomer(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error(error)
      }
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增客户</el-button>
    </div>

    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="industry" label="行业" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : row.status === 'lost' ? 'danger' : 'info'">
            {{ row.status === 'active' ? '活跃' : row.status === 'lost' ? '流失' : row.status === 'potential' ? '潜在' : '新建' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="owner.name" label="负责人" />
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="form.industry" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态">
            <el-option label="新建" value="new" />
            <el-option label="潜在" value="potential" />
            <el-option label="活跃" value="active" />
            <el-option label="流失" value="lost" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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
</style>

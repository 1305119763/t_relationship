<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { createAnnouncement } from '@/api/announcement'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'announcementCreated'): void
}>()

const form = reactive({
  category: '',
  title: '',
  recipient: 'all',
  content: ''
})

const rules = {
  category: [{ required: true, message: '请选择栏目', trigger: 'change' }],
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告详情', trigger: 'blur' }]
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
        await createAnnouncement({
          category: form.category,
          title: form.title,
          recipient: form.recipient,
          content: form.content
        })
        ElMessage.success('公告发布成功')
        emit('announcementCreated')
        emit('update:visible', false)
      } catch (error) {
        console.error('发布公告失败:', error)
        ElMessage.error('发布公告失败')
      }
    }
  })
}

const editorActions = [
  { label: '文件', icon: 'File' },
  { label: '编辑', icon: 'Edit' },
  { label: '插入', icon: 'Plus' },
  { label: '视图', icon: 'View' },
  { label: '格式', icon: 'Format' },
  { label: '表格', icon: 'Grid' }
]

const formatActions = [
  { icon: 'Bold', action: 'bold' },
  { icon: 'Italic', action: 'italic' },
  { icon: 'List', action: 'list' },
  { icon: 'Quote', action: 'quote' },
  { icon: 'AlignLeft', action: 'alignLeft' },
  { icon: 'AlignCenter', action: 'alignCenter' },
  { icon: 'AlignRight', action: 'alignRight' },
  { icon: 'Link', action: 'link' },
  { icon: 'Image', action: 'image' },
  { icon: 'FullScreen', action: 'fullscreen' }
]
</script>

<template>
  <el-dialog :model-value="props.visible" @update:model-value="(value) => emit('update:visible', value)" title="发布公告" width="700px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="选择栏目" prop="category" required>
        <el-select v-model="form.category" placeholder="选择分类" style="width: 100%;">
          <el-option label="公司新闻" value="company_news" />
          <el-option label="通知公告" value="announcement" />
          <el-option label="规章制度" value="rules" />
          <el-option label="人事公告" value="hr" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="公告标题" prop="title" required>
        <el-input v-model="form.title" placeholder="不能超过20个字" maxlength="20" show-word-limit />
      </el-form-item>
      
      <el-form-item label="接收人员" required>
        <el-radio-group v-model="form.recipient">
          <el-radio label="all">全体员工</el-radio>
          <el-radio label="specific">指定人员</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="公告详情" prop="content" required>
        <div class="rich-editor">
          <div class="editor-toolbar">
            <div class="toolbar-menu">
              <span v-for="action in editorActions" :key="action.label" class="menu-item">
                {{ action.label }}
                <el-icon><ArrowDown /></el-icon>
              </span>
            </div>
            <div class="toolbar-format">
              <el-button v-for="action in formatActions" :key="action.action" text size="small">
                <el-icon><component :is="action.icon" /></el-icon>
              </el-button>
            </div>
          </div>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="请输入文字"
            class="editor-content"
          />
        </div>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">发布</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.rich-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  
  .editor-toolbar {
    background-color: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;
    padding: 8px 12px;
    
    .toolbar-menu {
      display: flex;
      gap: 20px;
      margin-bottom: 8px;
      
      .menu-item {
        font-size: 14px;
        color: #606266;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        
        &:hover {
          color: #409eff;
        }
      }
    }
    
    .toolbar-format {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      
      .el-button {
        padding: 4px 8px;
      }
    }
  }
  
  .editor-content {
    :deep(.el-textarea__inner) {
      border: none;
      resize: none;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  Menu as IconMenu,
  User,
  Setting,
  Fold,
  Expand,
  DataLine,
  ChatDotRound,
  Check,
  Search,
  Bell,
  FullScreen
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapseKey = 'crm_sidebar_collapse'
const savedCollapse = typeof window !== 'undefined' ? localStorage.getItem(collapseKey) : null
const isCollapse = ref(savedCollapse === '1')
const activeMenu = computed(() => route.path)
const tabs = ref<{ name: string; label: string }[]>([])
const activeTab = ref('')

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const isFullscreen = ref(false)
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
}

const addTab = (path: string, label: string) => {
  if (!tabs.value.find(t => t.name === path)) {
    tabs.value.push({ name: path, label })
  }
  activeTab.value = path
}

watch(
  () => route.path,
  () => {
    const label = (route.meta.title as string) || (route.name as string) || 'Page'
    addTab(route.path, label)
  },
  { immediate: true }
)

watch(isCollapse, (val) => {
  try {
    localStorage.setItem(collapseKey, val ? '1' : '0')
  } catch {}
})

const handleTabClick = (pane: any) => {
  if (pane.props.name && pane.props.name !== route.path) {
    router.push(pane.props.name)
  }
}

const handleTabRemove = (name: string | number) => {
  const idx = tabs.value.findIndex(t => t.name === name)
  if (idx !== -1) {
    tabs.value.splice(idx, 1)
    const next = tabs.value[idx] || tabs.value[idx - 1] || tabs.value[0]
    if (next) {
      router.push(next.name)
    }
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '240px'" class="aside">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="logo" class="logo-img" />
        <span v-if="!isCollapse" class="logo-text">客户关系管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/">
          <el-icon><IconMenu /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="/data">
          <template #title>
            <el-icon><User /></el-icon>
            <span>数据</span>
          </template>
          <el-menu-item index="/customers">客户管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/workflow">
          <template #title>
            <el-icon><Check /></el-icon>
            <span>审批</span>
          </template>
          <el-menu-item index="/approvals">我的审批</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/analysis">
          <template #title>
            <el-icon><DataLine /></el-icon>
            <span>报表</span>
          </template>
          <el-menu-item index="/reports">报表仪表盘</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/tasks" disabled>
          <el-icon><Setting /></el-icon>
          <template #title>任务</template>
        </el-menu-item>
        <el-menu-item index="/collaboration" disabled>
          <el-icon><ChatDotRound /></el-icon>
          <template #title>协作</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="trigger" @click="toggleSidebar">
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-input class="header-search" size="small" :prefix-icon="Search" placeholder="搜索" />
          <el-icon class="header-icon"><Bell /></el-icon>
          <el-tooltip content="全屏" placement="bottom">
            <el-icon class="header-icon" @click="toggleFullscreen">
              <FullScreen />
            </el-icon>
          </el-tooltip>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userStore.userInfo?.name || '用户' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <el-tabs
          v-model="activeTab"
          type="card"
          class="route-tabs"
          @tab-click="handleTabClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="t in tabs"
            :key="t.name"
            :label="t.label"
            :name="t.name"
            closable
          />
        </el-tabs>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b2f3a;
    color: #fff;
    
    .logo-img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    
    .logo-text {
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
    }
  }
  
  .el-menu-vertical {
    border-right: none;
  }
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .trigger {
      font-size: 20px;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .header-search {
      width: 240px;
    }
    .header-icon {
      font-size: 18px;
      color: #606266;
    }
  }
}

.route-tabs {
  margin: 10px 0 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

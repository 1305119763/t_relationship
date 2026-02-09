<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="home">
    <h1>CRM Dashboard</h1>
    <el-button type="primary" @click="count++">Count is {{ count }}</el-button>
    <el-button @click="$router.push('/login')">Go to Login</el-button>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}
</style>

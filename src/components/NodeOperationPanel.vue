<template>
    <div class="operation-panel">
      <!-- 节点信息展示 -->
      <div class="info-section">
        <div class="info-header">节点详情</div>
        <el-form label-position="top" class="info-form">
          <el-form-item label="名称">
            <el-input 
              v-model="currentNode.Name" 
              :disabled="!isEditing"
              placeholder="未选择节点"
            />
          </el-form-item>
          <el-form-item label="父节点ID">
            <el-input 
              v-model="currentNode.Father" 
              disabled
              placeholder="无"
            />
          </el-form-item>
          <el-form-item label="ID">
            <el-input 
              v-model="currentNode.ID" 
              disabled
              placeholder="无"
            />
          </el-form-item>
          <el-form-item label="标签1">
            <el-input 
              v-model="currentNode.Lable01" 
              :disabled="!isEditing"
              placeholder="未设置"
            />
          </el-form-item>
          <el-form-item label="标签2">
            <el-input 
              v-model="currentNode.Lable02" 
              :disabled="!isEditing"
              placeholder="未设置"
            />
          </el-form-item>
          <el-form-item label="标签3">
            <el-input 
              v-model="currentNode.Lable03" 
              :disabled="!isEditing"
              placeholder="未设置"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button v-if='useAuthStore.isAdmin' type="primary" @click="handleAdd" :disabled="!currentNode.ID">新增子节点</el-button>
        <el-button v-if='useAuthStore.isAdmin' type="primary"  @click="handleDelete" :disabled="!currentNode.ID">删除此节点</el-button>
        <el-button v-if='useAuthStore.isAdmin' type="primary" @click="handleEdit" :disabled="!currentNode.ID">编辑此节点 </el-button>
      </div>
    </div>
  </template>
  
  <script setup>
import { useAuthStore } from '@/stores/auth';

  const props = defineProps({
    currentNode: Object, 
  });
  
const emit = defineEmits(['add', 'delete', 'edit', 'save']); // 定义事件
  
const handleAdd = () => emit('add');
 const handleDelete = () => emit('delete');
 const handleEdit = () => emit('edit');
  </script>
  
  <style scoped>
  .operation-panel {
    width: 320px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .info-section {
    margin-bottom: 20px;
  }
  
  .info-header {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .info-form :deep(.el-form-item) {
    margin-bottom: 12px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between; /* 按钮水平分布 */
    gap: 5px;
  }
  
  .action-buttons .el-button {
    margin: 0;
  }
  </style>
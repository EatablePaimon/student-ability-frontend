<template>
    <div class="search-box">
      <el-form :model="searchCriteria" label-width="100px" class="search-form">
        <el-form-item label="模糊搜索">
          <el-input v-model="searchCriteria.search" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="起止时间">
          <el-date-picker
            v-model="searchCriteria.start_at"
            type="date"
            placeholder="开始时间"
            style="width: 45%;"
            value-format="YYYY-MM-DD"
          />
          <el-date-picker
            v-model="searchCriteria.end_at"
            type="date"
            placeholder="结束时间"
            style="width: 45%;"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="学生ID">
          <el-input v-model="searchCriteria.stu_id" placeholder="请输入学生学号" />
        </el-form-item>
        <el-form-item label="能力ID">
          <el-input v-model="searchCriteria.cap_id" placeholder="请输入能力节点主键" />
        </el-form-item>
        <el-form-item label="来源ID">
          <el-input v-model="searchCriteria.src_id" placeholder="请输入来源主键" />
        </el-form-item>
        <el-form-item label="分数范围">
          <el-input-number
            v-model="searchCriteria.score_from"
            placeholder="最低分"
            :min="0" :max="100"
            style="width: 48%;"
          />
          <el-input-number
            v-model="searchCriteria.score_to"
            placeholder="最高分"
            :min="0" :max="100"
            style="width: 48%;"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="search-actions">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const searchCriteria = ref({
    search: '', 
    start_at: '', 
    end_at: '', 
    stu_id: '', 
    cap_id: '', 
    src_id: '',
    score_from: null, 
    score_to: null 
  });
  
  const emit = defineEmits(['search', 'reset']);
  
  const handleSearch = () => {
    emit('search', searchCriteria.value); 
  };
  
  const resetSearch = () => {
    searchCriteria.value = {
      search: '',
      start_at: '',
      end_at: '',
      stu_id: '',
      cap_id: '',
      src_id: '',
      score_from: null,
      score_to: null
    };
    emit('reset'); 
  };
  </script>
  
  <style scoped>
  .search-box {
    padding: 16px;
    background: #f9f9f9;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 16px;
    margin-left: 50px;
    margin-right: 50px;
  }

  .search-form {
    display: flex;
    flex-wrap: wrap;
  }

  .search-actions {
    text-align: right;
    margin-right: 50px;
    margin-bottom: 12px;
}
  </style>
<template>
    <div class="edit-container">
      <div class="page-header">
        <div>
          <router-link to="/comment" style="text-decoration: underline; color: inherit;">评价管理</router-link> / 编辑
        </div>
      </div>
      <el-card shadow="never">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="edit-form" v-loading="loading">
          <el-form-item label="学生ID:" prop="stu_number">
            <el-input v-model="form.stu_number" />
          </el-form-item>
          <el-form-item label="姓名:" prop="stu_name">
            <el-input v-model="form.stu_name" />
          </el-form-item>
          <el-form-item label="任务:" prop="task">
            <el-input v-model="form.task" />
          </el-form-item>
          <el-form-item label="任务描述:" prop="task_spec">
            <el-input v-model="form.task_spec" />
          </el-form-item>
          <el-form-item label="分数:" prop="score">
            <el-input-number v-model="form.score" :min="0" :max="100" />
          </el-form-item>
          <el-form-item label="评价依据:" prop="comments">
            <el-input type="textarea" v-model="form.comments" rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import request from '@/utils/request.js';
  import { ElMessage } from 'element-plus';
  
  const route = useRoute();
  const router = useRouter();
  const formRef = ref(null);
  const loading = ref(false);
  
  const form = ref({
    stu_number: '',
    stu_name: '',
    task: '',
    task_spec: '',
    score: null,
    comments: ''
  });
  
  const rules = {
    stu_number: [{ required: true, message: '学生ID不能为空', trigger: 'blur' }],
    stu_name: [{ required: true, message: '学生姓名不能为空', trigger: 'blur' }],
    task: [{ required: true, message: '任务不能为空', trigger: 'blur' }],
    task_spec: [{ required: true, message: '任务描述不能为空', trigger: 'blur' }],
    score: [{ required: true, message: '分数不能为空', trigger: 'blur' }],
    comments: [{ required: true, message: '评价依据不能为空', trigger: 'blur' }]
  };
  
  // 获取评论详情
  const fetchCommentDetail = async () => {
    try {
      loading.value = true;
      const res = await request.get(`/review/${route.params.id}`);
      if (res) {
        form.value = {
          stu_number: res.stu_number,
          stu_name: res.stu_name,
          task: res.task,
          task_spec: res.task_spec,
          score: res.score,
          comments: res.comments
        };
      }
    } catch (error) {
      console.error('获取评论详情失败:', error);
      ElMessage.error('获取评论详情失败');
    } finally {
      loading.value = false;
    }
  };
  
  // 保存修改
  const handleSave = async () => {
    if (!formRef.value) return;
    try {
      await formRef.value.validate();
      loading.value = true;
  
      const res = await request.put(`/review/${route.params.id}`, form.value);
      if (res && typeof res === 'object') {
        ElMessage.success('保存成功');
        router.push('/comment');
      } else {
        ElMessage.error(res.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      ElMessage.error('保存失败');
    } finally {
      loading.value = false;
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  onMounted(() => {
    fetchCommentDetail();
  });
  </script>
  
  <style scoped>
  .edit-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .page-header {
    margin-bottom: 30px;
  }
  
  .edit-form {
    background: #fff;
    padding: 50px;
    border-radius: 4px;
  }
  </style>
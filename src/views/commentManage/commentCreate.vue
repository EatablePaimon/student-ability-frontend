<template>
  <div class="app-create-container">
      <div class="page-header">
          <div>
              <router-link to="/comment" style="text-decoration: underline; color: inherit;">评价管理</router-link> / 新建
          </div>
      </div>
      <el-card shadow="never">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="create-form">
              <el-form-item label="来源id">
                  <el-input v-model.number="form.sourceid" placeholder="请输入来源id," />
              </el-form-item>
              <el-form-item label="能力id">
                  <el-input v-model.number="form.cap_id" placeholder="请输入能力id" />
              </el-form-item>
              <el-form-item label="学号">
                  <el-input v-model.number="form.stu_number" placeholder="请输入学号" />
              </el-form-item>
              <el-form-item label="学生名字" >
                  <el-input v-model="form.stu_name" placeholder="请输入学生名字" />
              </el-form-item>
              <el-form-item label="任务">
                  <el-input v-model="form.task" placeholder="请输入任务" />
              </el-form-item>
              <el-form-item label="任务描述">
                  <el-input v-model="form.task_spec" placeholder="请输入任务描述" />
              </el-form-item>
              <el-form-item label="分数">
                  <el-input v-model.number="form.score" placeholder="请输入分数" />
              </el-form-item>
              <el-form-item label="评分依据" >
                  <el-input v-model="form.stu_name" placeholder="请输入评分依据" />
              </el-form-item>
              <el-form-item>
                  <el-button @click="goBack">取消</el-button>
                  <el-button type="primary" @click="handleCreate" :loading="loading">保存</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
  source_id:0,
  cap_id:0,
  stu_number:0,
  stu_name:'',
  task:'',
  task_spec:'',
  score:0,
  comment:''

})

const rules = {
  source_id: [
      { type:'integer',required: true, message: '请输入来源id', trigger: 'blur' }
  ],
  cap_id: [
      { type:'integer',required: true, message: '请输入能力id', trigger: 'blur' }
  ],
  stu_number: [
      { type:'integer',required: true, message: '请输入学号', trigger: 'blur' }
  ],
  stu_name:[
      { required: true, message: '请输入学生名字',rigger: 'blur'}
  ],
  task:[
      { required: true, message: '请输入任务',rigger: 'blur'}
  ],
  score: [
      { type:'integer',required: true, message: '请输入分数', trigger: 'blur' }
  ],
  comment:[
      { required: true, message: '请输入评价依据',rigger: 'blur'}
  ],
}

const handleCreate = async () => {
  if (!formRef.value) return

  try {
      await formRef.value.validate()
      loading.value = true
      const res = await request.post('/comment', form.value)
      console.log(res);
      if (res.request.status == 201) {
          ElMessage.success('创建成功')
          router.push('/comment')
      } else {
          ElMessage.error(res.message)
      }
  } catch (error) {
      if (error.message) {
          console.error('创建应用失败:', error)
          ElMessage.error('创建失败')
      }
  } finally {
      loading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.app-create-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.create-form {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}
</style>
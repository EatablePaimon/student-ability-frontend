<template>
    <div class="edit-container">
        <div class="page-header">
            <div>
                <router-link to="/source" style="text-decoration: underline; color: inherit;">评价来源管理</router-link> /编辑
            </div>
        </div>
        <el-card shadow="never">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="edit-form" v-loading="loading">
                <el-form-item label="id">
                    <div>{{ route.params.id }}</div>
                </el-form-item>
                <el-form-item label="来源名称" prop="name">
                    <el-input v-model="form.name"  />
                </el-form-item>
                <el-form-item label="Key" prop="app_key">
                    <el-input v-model="form.app_key" placeholder="如果不填写则由应用自动分配" />
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request.js'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
    name: '',
    app_key: '',
})

const rules = {
    name: [
        { required: false, trigger: 'blur' }
    ],
    app_key: [
        { required: false, trigger: 'blur' }
    ],
}

const fetchDetail = async () => {
    try {
      loading.value = true;
      const res = await request.get(`/sourcekey/${route.params.id}`);
      if (res) {
        form.value = {
            name: res.name,
            app_key: res.app_key,
        };
      }
    } catch (error) {
      console.error('获取详情失败:', error);
      ElMessage.error('获取详情失败');
    } finally {
      loading.value = false;
    }
  };

const handleSave = async () => {
    if (!formRef.value) return
    console.log(form.value);
    try {
        await formRef.value.validate()
        loading.value = true
        
        const res = await request.put(`/sourcekey/${route.params.id}`, form.value);
        console.log(res);
        if (res && typeof res === 'object') {
            ElMessage.success('保存成功')
            router.push('/source')
        } else {
            ElMessage.error(res.message)
        }
    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    router.back()
}

onMounted(() => {
    fetchDetail();
})
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
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}
</style>
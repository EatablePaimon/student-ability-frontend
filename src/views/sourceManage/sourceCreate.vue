<template>
    <div class="app-create-container">
        <div class="page-header">
            <div>
                <router-link to="/source" style="text-decoration: underline; color: inherit;">评价来源管理</router-link> / 新建
            </div>
        </div>
        <el-card shadow="never">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="create-form">
                <el-form-item label="来源名称" prop="name">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="Key" prop="app_key">
                    <el-input v-model="form.app_key" placeholder="如果不填写，则由应用自动分配" />
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
    key:'',
    name: ''
})

const rules = {
    name: [
        { required: true, message: '请输入来源名称', trigger: 'blur' }
    ],
    app_key:[
        { required: false, message: '请输入app_key',rigger: 'blur'}
    ],
}

const handleCreate = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        loading.value = true
        const res = await request.post('/sourcekey', form.value)
        if (res) {
            ElMessage.success('创建成功')
            router.push('/source')
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
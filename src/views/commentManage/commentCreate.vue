<template>
    <div class="app-create-container">
        <div class="page-header">
            <div>
                <router-link to="/comment" style="text-decoration: underline; color: inherit;">评价管理</router-link> / 新建
            </div>
        </div>
        <el-card shadow="never">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="create-form">
                <el-form-item label="创建时间" prop="created_at">
                    <el-date-picker v-model="form.created_at" type="datetime" placeholder="请选择创建时间"
                        value-format="YYYY-MM-DDTHH:mm:ssZ" style="width: 100%;" />
                </el-form-item>
                <el-form-item v-if='useAuthStore.isAdmin' label="来源ID">
                    <el-input v-model.number="form.source_id" placeholder="请输入来源ID" />
                </el-form-item>
                <el-form-item label="能力ID">
                    <el-input v-model.number="form.cap_id" placeholder="请输入能力ID" />
                </el-form-item>
                <el-form-item label="学生ID">
                    <el-input v-model.number="form.stu_number" placeholder="请输入学生ID" />
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.stu_name" placeholder="请输入学生姓名" />
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
                <el-form-item label="评价依据">
                    <el-input v-model="form.comment" placeholder="请输入评价依据" />
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
    created_at: new Date().toISOString(), 
    source_id: useAuthStore.id ,
    cap_id: '',
    stu_number: '',
    stu_name: '',
    task: '',
    task_spec: '',
    score: '',
    comment: ''

})

const rules = {
    created_at: [
        { type: 'date', required: true, message: '请选择创建时间', trigger: 'blur' }
    ],
    source_id: [
        { type: 'integer', required: true, message: '请输入来源id', trigger: 'blur' }
    ],
    cap_id: [
        { type: 'integer', required: true, message: '请输入能力id', trigger: 'blur' }
    ],
    stu_number: [
        { type: 'integer', required: true, message: '请输入学号', trigger: 'blur' }
    ],
    stu_name: [
        { required: true, message: '请输入学生名字', rigger: 'blur' }
    ],
    task: [
        { required: true, message: '请输入任务', rigger: 'blur' }
    ],
    score: [
        { type: 'integer', required: true, message: '请输入分数', trigger: 'blur' }
    ],
    comment: [
        { required: true, message: '请输入评价依据', rigger: 'blur' }
    ],
}

const handleCreate = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
        loading.value = true
        const res = await request.post('/review', form.value)
        console.log(res);
        if (res && typeof res === 'object') {
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
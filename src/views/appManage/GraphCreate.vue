<template>
    <div class="app-create-container">
        <div class="page-header">
            <div>
                <router-link to="/graph" style="text-decoration: underline; color: inherit;">能力图谱管理</router-link> / 新建
            </div>
        </div>
        <el-card shadow="never">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="create-form">
                <el-form-item label="能力图谱名称" prop = "name">
                    <el-input v-model="form.name" placeholder="请输入知识图谱名称" />
                </el-form-item>
                <el-form-item label="根节点" prop = "root">
                    <el-input v-model.number="form.root" placeholder="请输入根节点id,留空则自动分配" />
                </el-form-item>
                <el-form-item label="标签1" prop = "label01">
                    <el-input v-model="form.label01" placeholder="请输入标签1" />
                </el-form-item>
                <el-form-item label="标签2" prop = "label02">
                    <el-input v-model="form.label02" placeholder="请输入标签2" />
                </el-form-item>
                <el-form-item label="标签3" prop = "label03">
                    <el-input v-model="form.label03" placeholder="请输入标签3" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleCreate" :loading="loading">创建</el-button>
                    <el-button @click="goBack">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {post} from '@/api/graph.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
    name: '',
    root:'',
    label01:'',
    label02:'',
    label03:''
})

const rules = {
    name: [
        { required: true, message: '请输入图谱名称', trigger: 'blur' }
    ],
    root: [
        { 
        validator: (rules,value, callback) => {
        if (value === null || value === undefined || value === '') {
          callback(); 
        } else if (!Number.isInteger(value) || value <= 0) {
          callback(new Error('根节点必须是正整数'));
        } else {
          callback(); // 校验通过
        }
      },
      trigger: 'blur'
    }
    ],
    label01: [
        { required: false, trigger: 'blur' }
    ],
    label02: [
        { required: false, trigger: 'blur' }
    ],
    label03: [
        { required: false, trigger: 'blur' }
    ],
}

const handleCreate = async () => {
    if (!formRef.value) 
    {
        ElMessage.error('请确保表单数据格式正确')
        return
    }
    try {
        await formRef.value.validate()
        loading.value = true
        if(!form.value.root)
        {
            delete form.value.root;
        }
        const res = await post(form.value);
        ElMessage.success('创建成功')
        router.push('/graph')
    } catch (error) {
        if (error.message) {
            ElMessage.error('创建失败,请重试,请确认输入有效根节点')
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
}
</style>
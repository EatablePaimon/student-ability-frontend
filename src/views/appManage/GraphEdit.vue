<template>
    <div class="edit-container">
        <div class="page-header">
            <div>
                <router-link to="/graph" style="text-decoration: underline; color: inherit;">能力图谱管理</router-link> / 编辑
            </div>
        </div>
        <el-card shadow="never">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="edit-form" v-loading="loading">
                <el-form-item label="图谱名称" prop="name">
                    <el-input v-model="form.name"  />
                </el-form-item>
                <el-form-item label="标签1" prop="label01">
                    <el-input v-model="form.label01" />
                </el-form-item>
                <el-form-item label="标签2" prop="label02">
                    <el-input v-model="form.label02" />
                </el-form-item>
                <el-form-item label="标签3" prop="label03">
                    <el-input v-model="form.label01" />
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
import { getdetail } from '@/api/graph'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const res = ref(null)
const form = ref({
    name:"",
    label01:"",
    label02:"",
    label03:""
})

const rules = {
    name: [
        { required: false, trigger: 'blur' }
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

const fetchDetail = async (id) => {
  try {
    loading.value = true;
    res.value = await getdetail(id); 
    console.log(res.value);
    form.value = {
    name: res.value.Name, 
    label01: res.value.Lable01,
    label02: res.value.Lable02,
    label03: res.value.Lable03
    };
  } catch (error) {
    ElMessage.error('获取详情失败，请重试');
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
    if (!formRef.value) return
    console.log(route.params.id);
    try {
        await formRef.value.validate()
        loading.value = true
        const res = await request.put(`/sourcekey/${route.params.id}`, form.value);
        console.log(res);
        if (res.rows_affected == 1) {
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
    if (route.params?.id) {
    fetchDetail(route.params.id);
  }
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
}
</style>                                                                                         
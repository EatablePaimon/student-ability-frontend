<template>
    <div class="login-container">
        <el-card class="login-card" shadow="never">
            <div class="card-content">
                <div class="login-title">学生能力图谱管理</div>
                <el-input v-model="adminKey" placeholder="请输入管理Key" class="login-input" clearable @keyup.enter="onLogin" />
                <el-button type="primary" class="login-btn" @click="onLogin" :loading="loading">确定</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { setAdminKey } from '@/utils/key'
import { login } from '@/api/login'

const router = useRouter()

const adminKey = ref('')
const loading = ref(false)

const onLogin = async () => {
    if (!adminKey.value?.trim()) {
        ElMessage({ message: '请输入管理KEY', type: 'warning' })
        return;
    }

    loading.value = true;
    try {         
        const res = await login(adminKey.value)
        if (res.admin == true) {
            setAdminKey(res.token); 
            router.push('/');
            ElMessage({ message: '登录成功', type: 'success' });
        } 
    } catch (error) {
        console.error('登录失败:', error);
        const message = error.response?.data?.message || error.message || '未知错误';
        ElMessage({ message: `登录失败: ${message}`, type: 'error' });
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.login-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
}

.login-card {
    margin-top: -100px;
    width: 450px;
    padding: 30px 20px;
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-title {
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 32px;
}

.login-input {
    width: 350px;
    margin-bottom: 24px;
}

.login-btn {
    width: 200px;
    height: 40px;
    background: #00b4f0;
    color: #fff;
    font-size: 18px;
    border: none;
}
</style>
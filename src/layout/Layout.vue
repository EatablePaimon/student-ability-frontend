<template>
    <el-container style="padding-top: 10px;">
        <el-header class="header" style="padding-left: 35px;">
            <div class="header-container">
                <a-menu v-model:selectedKeys="activeIndex" mode="horizontal" :items="menuItems" class="flex-grow menu-no-border"/>
                <el-button type="info" @click="handleLogout" style="margin-right: 50px;">退出登录</el-button>
            </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { removeAppKey } from '@/utils/key'
import { 
  DeploymentUnitOutlined, 
  CloudUploadOutlined, 
  CommentOutlined 
} from '@ant-design/icons-vue';


const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const activeIndex = computed(() => {
    const currentPath = route.path;

    const menuPaths = [
        '/graph',
        '/source',
        '/comment'
    ];

    let bestMatch = '';
    for (const path of menuPaths) {
        if (currentPath.startsWith(path)) {
            // 找到最长的匹配前缀
            if (path.length > bestMatch.length) {
                bestMatch = path;
            }
        }
    }
    return [bestMatch.substring(1)]; // 移除前导斜杠，转换为数组
})

// 菜单项定义
const menuItems = [
  {
    key: 'graph',
    icon: () => h(DeploymentUnitOutlined),  // 拓扑结构图标
    label: '能力图谱管理',
    onClick: () => router.push('/graph'),
    visible: true
  },
  {
    key: 'source',
    icon: () => h(CloudUploadOutlined),     // 云端数据源图标
    label: '评价来源管理',
    onClick: () => router.push('/source'),
    visible: authStore.isAdmin
  },
  {
    key: 'comment',
    icon: () => h(CommentOutlined),        // 对话气泡图标
    label: '评价管理',
    onClick: () => router.push('/comment'),
    visible: true
  }
].filter(item => item.visible !== false);

const handleLogout = () => {
    ElMessageBox.confirm(
        '确定要退出吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        removeAppKey()
        router.push('/login')
    })
}
</script>

<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.header {
    padding: 0;
    height: 40px;
    line-height: 60px;
}

.flex-grow {
    flex-grow: 1;
}

:deep(.el-menu) {
    border-bottom: none;
}

:deep(.menu-no-border) {
    border-bottom: none !important;
}

:deep(.ant-menu) {
    border-bottom: none !important;
}

:deep(.ant-menu-horizontal) {
    border-bottom: none !important;
}

:deep(.ant-menu-horizontal::after) {
    display: none !important;
}
</style>
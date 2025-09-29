<template>
    <div class="table-header">
        <div class="app-count">当前共有 {{total}} 个评价来源</div>
        <el-button type="primary" class="create-btn" @click="goToCreate">新建</el-button>
    </div>
    <div class="table-container">
        <el-table :data="appList" style="width: 100%" border v-loading="loading">
            <el-table-column label="ID" width="180">
                <template #default="scope">
                    <div>{{ scope.row.ID }}</div>
                </template>
            </el-table-column> 
            <el-table-column label="来源名称">  
                <template #default="scope">
                    <div style="color: #888; font-size: 12px;">{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Key">
                <template #default="scope">
                    <div>{{ scope.row.app_key}}</div>
                </template>
            </el-table-column>          
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <div style="display: flex; justify-content: center; gap: 12px;">
                        <el-button type="primary" @click="goToEdit(scope.row.ID)">编辑</el-button>
                        <el-button type="danger" @click="remove(scope.row.ID)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination-wrapper">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request.js'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
        
const router = useRouter() 
const appList = ref([])
const loading = ref(false)
const currentPage = ref(1);   
const pageSize = ref(20);     
const total = ref(0);    

const goToCreate = () => {   
    router.push('/source/create')
}

const goToEdit = (id) => {
    router.push(`/source/edit/${id}`)
}                     


const remove = async (id) => {
    ElMessageBox.confirm(
        '确定要删除此评价来源吗？继续此操作将会同时删除与此来源相关的全部评价，且不可恢复！',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            const res = await request.delete(`/sourcekey/${id}`)
            if (res) {
                ElMessage.success("删除成功")
                fetchAppList();
            } else {
                ElMessage.error(res.message)
            }     
        } catch (error) {
            console.error('删除失败:', error)
        }
    })
}

const fetchAppList = async () => {
  try {
    loading.value = true;
    const res = await request.get('/sourcekey', {
      params: { 
        page: currentPage.value,
        pageSize: pageSize.value
      }
    });
    if (res) {                    
      appList.value = res.data; 
      total.value = res.total;  
    }      
  } finally {
    loading.value = false;
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchAppList()
}

onMounted(() => {
    fetchAppList()
})
</script>

<style scoped>
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-left: 50px;
    padding-right: 50px;
}

.app-count {
    font-size: 14px;
    color: #606266;
}

.create-btn {
    margin-left: auto;
}

.table-container {
    margin: 0 50px 0 50px;
}

.pagination-wrapper {
  width: 100%;
  position: fixed;      /* 固定定位 */
  left: 0px;
  bottom : 15px;
  background: #fff;
  padding: 16px 0;
  text-align: center;
  z-index: 100;
  padding-left: 80px;
}
</style>
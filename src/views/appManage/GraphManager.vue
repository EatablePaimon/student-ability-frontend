<template>
    <div class="table-header">
        <div class="app-count">当前共有 {{ total }} 个能力图谱</div>
        <el-button type="primary" class="create-btn" @click="goToCreate">新建</el-button>
    </div>
    <div class="table-container">           
        <el-table :data="appList" style="width: 100%" border v-loading="false">
            <el-table-column label="图谱名称">
                <template #default="scope">
                    <div>{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="根节点">
                <template #default="scope">
                    <div>{{ detailsMap[scope.row.ID]}}({{scope.row.root}})</div>
                </template>
            </el-table-column>
            <el-table-column label="标签">
                <template #default="scope">
                    <div>标签1: {{ scope.row.lable01}}</div>
                    <div>标签2: {{ scope.row.lable02}}</div>
                    <div>标签3: {{ scope.row.lable03}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <div class="button-group">
                        <div class="button-row ">
                        <el-button type="primary" @click="goToDetail(scope.row.ID, scope.row.name)">详情</el-button>
                        <el-button type="primary" @click="goToPermission(scope.row.ID)">权限</el-button>
                        </div>
                        <div class="button-row">
                        <el-button type="primary" @click="goToEdit(scope.row.ID)">编辑</el-button>
                        <el-button type="danger" @click="remove(scope.row.ID)">删除</el-button>
                        </div>
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
import {getlist,Delete,getdetail} from '@/api/graph.js'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const appList = ref([])
const loading = ref(false)
const currentPage = ref(1);   
const pageSize = ref(12);     
const total = ref(0);    
const detailsMap = ref({})

const goToCreate = () => {
    router.push('/graph/create')
}

const goToDetail = (id, name) => {
  router.push({ path: `/graph/detail/${id}`, query: { name } });
};
const goToEdit = (id) => {
    router.push(`/graph/edit/${id}`)
}

const goToPermission = (id) => {
    router.push(`/graph/permission/${id}`)
}

const remove = async (id) => {
    ElMessageBox.confirm(
        '确定要删除吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            const res = await Delete(id);
            if (res.rows_affected == 1) {
                ElMessage.success("删除成功")
                if(total%12==1)
                {
                    currentPage --;
                    currentPage =max(currentPage,1);
                }
                fetchAppList();
            } else {
                ElMessage.error(res.message)
            }
        } catch (error) {
            console.error('删除应用失败:', error)
        }
    })
}

const fetchAppList = async () => {
  try {
    loading.value = true;
    const res = await getlist(currentPage.value,pageSize.value);
    appList.value = res.data; 
    total.value = res.total; 
    for (const item of appList.value) {
    {   
        const res = await getdetail(item.ID);  
        detailsMap.value[item.ID] = res.Name
    }
  }
  }catch (error) {
      ElMessage.error("请求失败,请重试");
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

.button-group {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap: 10px;
}

.button-row {
  display: flex;
  justify-content: center; 
  gap: 10px; 
}     

.pagination-wrapper {
  width: 100%;
  position: fixed;     
  left: 0px;
  bottom : 15px;
  background: #fff;
  padding: 16px 0;
  text-align: center;
  z-index: 100;
  padding-left: 80px;
}
</style>
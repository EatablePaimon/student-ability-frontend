<template>
    <div class="table-header">
      <div class="app-count">当前共有 {{ total }} 个评价</div>
      <div>
        <el-button type="primary" class="create-btn" @click="goToCreate">新建</el-button>
      </div>
    </div>
    <SearchBox
      :searchCriteria="searchCriteria"
      @search="handleSearch"
      @reset="resetSearch"
    />
    <div class="table-container">
      <el-table :data="appList" style="width: 100%" border v-loading="loading">
        <el-table-column label="创建时间">  
          <template #default="scope">
            <div style="color: #888; font-size: 12px;">{{ new Date(scope.row.created_at).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="学生">
          <template #default="scope">
            <div> 
              学号：<span>{{ scope.row.stu_number }}</span>
            </div>
            <div>
              姓名：<span>{{ scope.row.stu_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="能力">
          <template #default="scope">
            <div> 
              能力名称:<span>{{scope.row.cap_name}} </span>
            </div>
            <div> 
              来源名称:<span>{{scope.row.source_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="任务">
        <template #default="scope">
          <div>
            任务：<span>{{ scope.row.task }}</span>
          </div>
          <div>
            描述：<span>{{ scope.row.task_spec }}</span>
          </div>
        </template>
      </el-table-column>
        <el-table-column label="评价">
          <template #default="scope">
            <div>
              分数：<span>{{ scope.row.score }}
                    </span>
            </div>
            <div>
              依据：<span> {{ scope.row.comments }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <div style="display: flex; justify-content: center; gap: 12px;">
              <el-button type="primary" @click="goToEdit(scope.row.id)">编辑</el-button>
              <el-button type="danger" @click="remove(scope.row.id)">删除</el-button>
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
import SearchBox from '@/components/SearchBox.vue'

const router = useRouter() 

const appList = ref([])
const loading = ref(false)
const currentPage = ref(1)             
const pageSize = ref(20)
const total = ref(0)

const searchCriteria = ref({
  search: '',
  start_at: '',
  end_at: '',
  stu_id: '',
  cap_id: '',
  src_id: '',
  score_from: null,
  score_to: null,
});

const handleSearch = (criteria) => {
  currentPage.value = 1;
  searchCriteria.value = { ...criteria }; 
  console.log(searchCriteria.value);
  fetchAppList();
};

const goToCreate = () => {   
  router.push('/comment/create')
}

const goToEdit = (id) => {
  router.push(`/comment/edit/${id}`)
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
      const res = await request.delete(`/review/${id}`)
        ElMessage.success("删除成功")
        if(total%12==1)
        {
          currentPage --;
          currentPage =max(currentPage,1);
        }
        fetchAppList();      
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const fetchAppList = async () => {
  try {
    loading.value = true;
    const res = await request.get('/review', {
      params: { 
        page: currentPage.value,
        pageSize: pageSize.value,
        ...searchCriteria.value
      }
    });   
    console.log(res);         
      appList.value = res.data; 
      total.value = res.total;  
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false;
  }
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

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
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
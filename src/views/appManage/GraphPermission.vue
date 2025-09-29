<template>
    <div class="permission-container">
        <div class="page-header">
            <div>
                <router-link to="/graph" style="text-decoration: underline; color: inherit;">能力图谱管理</router-link> /
                查看权限管理 ({{ graphName }} )
            </div>
        </div>
        <div class="table-container">
            <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="name" label="来源名称" />
                <el-table-column label="允许查看">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.checked" @change="val => handleCheckChange(scope.row, val)" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getdetail, getpermission, putpermission,removepermission } from '@/api/graph'
import { useRoute } from 'vue-router'
const route = useRoute()
const graphName = ref('')
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])
const total = ref(0)

const handleCheckChange = async (row, checked) => {
    const data = {
        source_key_id: row.id,
        graph_id: Number(route.params.id)
    }
    try {
       if(checked)
       {
        await putpermission(data); 
       }
       else
       {    
        await removepermission(data);
       }
        ElMessage.success(`用户 ${row.name} 权限已${checked ? '开启' : '关闭'}`)
    } catch (error) {
        row.checked = !checked
        ElMessage.error('权限设置失败')
        console.error(error)
    }
}

const fetchName = async (id) => {
    const res = await getdetail(id);
    graphName.value = res.Name;
};

const fetchPermission = async (id, page, pageSize) => {
    const res = await getpermission(id, page, pageSize);
    const users = res.data || [];
    tableData.value = users.map(user => ({
        id: user.ID,
        name: user.name,
        checked: user.viewable
    }));
};

onMounted(() => {
    fetchName(route.params.id);
    fetchPermission(route.params.id, page.value, pageSize.value);
});
</script>

<style scoped>
.permission-container {
    padding: 20px;
    margin-left: 50px;

    margin: 0 auto;
}

.page-header {
    margin-left: 30px;
    margin-bottom: 30px;
}
.table-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-left: 30px;
}
</style>
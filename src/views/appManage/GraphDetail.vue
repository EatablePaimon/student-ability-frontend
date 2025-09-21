<template>
  <div class="page-header">
    <div>
      <router-link to="/graph" style="text-decoration: underline; color: inherit;">能力图谱管理</router-link> / {{ route.query.name }}
    </div>
  </div>
  <div class="radial-tree-container">
      <NodeOperationPanel
        :currentNode="currentNode"
        :isEditing="isEditing"
        @add="handleAdd"
        @delete="handleDelete"
        @edit="startEditing"
        @save="handleSave"
      />
      <div ref="chartRef" style="width: 100%; height: 82vh"></div>
  </div>
 
  <el-dialog v-model="addDialogVisible" title="新增子节点" width="500px">
  <el-form :model="newNode" label-position="top">
    <el-form-item label="名称" required>
      <el-input v-model="newNode.name" placeholder="输入节点名称" />
    </el-form-item> 
    <el-form-item label="父节点" required>
      <el-input 
        :value="`${currentNode.Name} (ID: ${currentNode.ID})`" 
        disabled 
        placeholder="未选择父节点" 
      />
    </el-form-item>
    <el-form-item label="标签1">
      <el-input v-model="newNode.label01" />
    </el-form-item>
    <el-form-item label="标签2">
      <el-input v-model="newNode.label02" />
    </el-form-item>
    <el-form-item label="标签3">
      <el-input v-model="newNode.label03" />
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="addDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="confirmAdd">确定</el-button>
  </template>
</el-dialog>


<el-dialog v-model="editDialogVisible" title="编辑此节点" width="500px">
  <el-form :model="editNode" label-position="top">
    <el-form-item label="名称" required>
      <el-input v-model="editNode.name" placeholder="输入节点名称" />
    </el-form-item>
    <el-form-item label="父节点" required>
      <el-input-number 
        v-model="editNode.father" 
        :min="1" 
        placeholder="输入父节点ID"
      />
    </el-form-item>
    <el-form-item label="标签1">
      <el-input v-model="editNode.label01" />
    </el-form-item>
    <el-form-item label="标签2">
      <el-input v-model="editNode.label02" />
    </el-form-item>
    <el-form-item label="标签3">
      <el-input v-model="editNode.label03" />
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="editDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="confirmEdit">确定</el-button>
  </template>
</el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import NodeOperationPanel from '@/components/NodeOperationPanel.vue';

const route = useRoute();
const treeData = ref(null);
const chartRef = ref(null);
const chartInstance = ref(null);
const currentNode = ref({}); 
const isEditing = ref(false); 
const addDialogVisible = ref(false); 
const newNode = ref({
  name: '',
  father: null,
  label01: '',
  label02: '',
  label03: ''
});
const originalNodeData = ref({});

// 初始化当前节点数据
const initCurrentNode = () => ({
  ID: null,
  Name: '',
  Father: null,
  Lable01: '',
  Lable02: '',
  Lable03: ''
});

// 处理API返回的数据结构
const processNode = (node) => {
  if (!node.children) node.children = [];
  return {
    ID: node.ID,
    Name: node.Name,
    Father: node.Father,
    Lable01: node.Lable01,
    Lable02: node.Lable02,
    Lable03: node.Lable03,
    children: node.children.map((child) => processNode(child))
  };
};

// 获取树图数据
const fetchTreeData = async (id) => {
  try {
    const response = await request.get(`/graph/${id}`);
    if (response) {
      treeData.value = processNode(response);
      if (treeData.value) {
        currentNode.value = { ...treeData.value };
        originalNodeData.value = { ...treeData.value };
      }
      if (chartInstance.value) {
        updateChart();
      } else {
        initChart();
      }
    }
  } catch (error) {
    console.error('获取树图数据失败:', error);
    ElMessage.error('加载树图数据失败');
  }
};

// 初始化图表
const initChart = () => {
  if (!chartRef.value || !treeData.value) return;
  chartInstance.value = echarts.init(chartRef.value);
  chartInstance.value.on('click', handleNodeClick);
  updateChart();
};

const getChartOption = () => {
  
  return {
    tooltip: { 
      trigger: 'item',
      formatter: (params) => `
        <div>
          <strong>${params.data.Name}</strong>
          <div>ID: ${params.data.ID}</div>
          ${params.data.Lable01 ? `<div>${params.data.Lable01}</div>` : ''}
        </div>
      `
    },
    series: [{
      type: 'tree',
      data: [treeData.value],
      layout: 'radial',
      symbol: 'circle',
      symbolSize: 25,
      roam: true,
      expandAndCollapse: true,
      initialTreeDepth: -1,  
      label: {
        position: 'right',
        verticalAlign: 'middle',
        distance: 10,
        fontSize: 12,
        formatter: (params) => params.data.Name,
        rotate: 0 
      },
      itemStyle: {
        
        color: '#91cc75', 
        borderColor: '#409eff',
        borderWidth: 1
      },
      lineStyle: {
        color: '#91cc75',
        width: 2,
        curveness: 0.3
      },
      radial: {
        radius: ['10%', '90%'],
        center: ['50%', '50%'],
        symbol: 'emptyCircle'
      },
      animationDurationUpdate: 750,
      leaves: {
        label: { 
          position: 'outside', 
          align: 'center',
          rotate: 0  
        },
        itemStyle: { 
          color: '#91cc75' 
        }
      },
      emphasis: {
        focus: 'descendant',
        itemStyle: {
          color: '#91cc75',  
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance.value || !treeData.value) return;
  chartInstance.value.clear();
  chartInstance.value.setOption(getChartOption(), true);
};

// 节点点击事件
const handleNodeClick = (params) => {
  if (params.data && params.data.ID) {
    fetchNodeDetail(params.data.ID);
    isEditing.value = false;
  }
};

// 获取节点详细信息
const fetchNodeDetail = async (id) => {
  try {
    const response = await request.get(`/capability/${id}`);
    if (response) {
      currentNode.value = {
        ID: response.ID,
        Name: response.Name,
        Father: response.Father,
        Lable01: response.Lable01,
        Lable02: response.Lable02,
        Lable03: response.Lable03
      };
      originalNodeData.value = { ...currentNode.value };
    }
  } catch (error) {
    console.error('获取节点详情失败:', error);
    ElMessage.error('加载节点详情失败');
  }
};

// 添加节点
const handleAdd = () => {
  newNode.value = {
    name: '',
    father: currentNode.value.ID || null,
    label01: '',
    label02: '',
    label03: ''
  };
  addDialogVisible.value = true;
};

// 确认添加节点
const confirmAdd = async () => {
  if (!newNode.value.name || !newNode.value.father) {
    ElMessage.warning('名称和父节点ID是必填项');
    return;
  }
  try {
    await request.post('/capability', {
      name: newNode.value.name,
      lable01: newNode.value.label01,
      lable02: newNode.value.label02,
      lable03: newNode.value.label03,
      father: newNode.value.father
    });
    ElMessage.success('节点添加成功');
    addDialogVisible.value = false;
    await fetchTreeData(route.params.id);
  } catch (error) {
    console.error('添加节点失败:', error);
    ElMessage.error('添加节点失败');
  }
};

// 删除节点
const handleDelete = async () => {
  if (!currentNode.value.ID) return;
  try {
    await ElMessageBox.confirm(
      `确定要删除节点 "${currentNode.value.Name}" 及其所有子节点吗？`,
      '警告',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    await request.delete(`/capability/${currentNode.value.ID}`);
    ElMessage.success('节点删除成功');
    await fetchTreeData(route.params.id);
    currentNode.value = initCurrentNode();
    isEditing.value = false;
  } catch (error) {
    console.error('删除节点失败:', error);
    ElMessage.error('删除节点失败');
  }
};

// 保存节点修改
const handleSave = async () => {
  if (!currentNode.value.ID) return;
  try {
    await request.put(`/capability/${currentNode.value.ID}`, {
      name: currentNode.value.Name,
      lable01: currentNode.value.Lable01,
      lable02: currentNode.value.Lable02,
      lable03: currentNode.value.Lable03,
      father: currentNode.value.Father
    });
    ElMessage.success('节点更新成功');
    isEditing.value = false;
    await fetchTreeData(route.params.id);
  } catch (error) {
    console.error('更新节点失败:', error);
    ElMessage.error('更新节点失败');
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchTreeData(route.params.id);
  }
});


const editDialogVisible = ref(false); // 编辑节点弹窗的显示状态
const editNode = ref({
  name: '',
  father: null, // 父节点ID
  label01: '',
  label02: '',
  label03: ''
});

const startEditing = () => {
  if (!currentNode.value.ID) {
    ElMessage.warning('请先选择一个节点');
    return;
  }
  // 初始化编辑节点数据
  editNode.value = {
    name: currentNode.value.Name,
    father: currentNode.value.Father, // 初始化为当前节点的父节点ID
    label01: currentNode.value.Lable01,
    label02: currentNode.value.Lable02,
    label03: currentNode.value.Lable03
  };
  editDialogVisible.value = true; // 打开编辑弹窗
};

const confirmEdit = async () => {
  try {
    await request.put(`/capability/${currentNode.value.ID}`, {
      name: editNode.value.name,
      father: editNode.value.father, // 发送父节点ID
      lable01: editNode.value.label01,
      lable02: editNode.value.label02,
      lable03: editNode.value.label03
    });
    ElMessage.success('节点修改成功');
    editDialogVisible.value = false; // 关闭弹窗
    await fetchTreeData(route.params.id); 
  } catch (error) {
    console.error('编辑节点失败:', error);
    ElMessage.error('编辑节点失败');
  }
};

</script>

<style scoped>
.page-header {
  margin: 5px 50px;
}

.radial-tree-container {
  position: relative;
  margin: 0 50px;
  padding: 50px;
  background: #f5f7fa;
  display: flex;
}

.operation-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 10;
}
</style>
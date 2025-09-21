import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layout/Layout.vue";
import { getAdminKey } from "../utils/key";
import { ElMessage } from "element-plus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Layout,
      redirect: "/graph",
      meta: { requiresAuth: true },
      children: [
        {
          path: "graph",
          name: "graph",
          component: () => import("../views/appManage/GraphManager.vue"),
        },
        {
          path: "graph/create",
          name: "graphCreate",
          component: () => import("../views/appManage/GraphCreate.vue"),
        },
        {
         path: "graph/detail/:id",
          name: "graphDetail",
          component: () => import("../views/appManage/GraphDetail.vue"),
        },
        {
          path: "graph/edit/:id",
          name: "graphEdit",
          component: () => import("../views/appManage/GraphEdit.vue"),
        },
        {
          path: "/source",
          name: "source",
          component: () => import("../views/sourceManage/sourceManager.vue"),
        },
        {
          path: "/source/create",
          name: "sourceCreate",
          component: () => import("../views/sourceManage/sourceCreate.vue"),
        },
        {
          path: "/source/edit/:id",
          name: "sourceEdit",
          component: () => import("../views/sourceManage/sourceEdit.vue"),
        },           
        {              
          path: "/comment",
          name: "comment",
          component: () => import("../views/commentManage/commentManager.vue"),
        },
        {              
          path: "/comment/create",
          name: "commentCreate",
          component: () => import("../views/commentManage/commentCreate.vue"),
        },   
        {              
          path: "/comment/edit/:id",
          name: "commentEdit",
          component: () => import("../views/commentManage/commentEdit.vue"),
        },   
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
  ],
});
  
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const adminKey = getAdminKey();
  // 需要登录的页面，但没有管理员KEY
  if (to.meta.requiresAuth && (!adminKey || adminKey === "undefined")) {
    // ElMessage.warning("请先输入管理KEY！");
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;

import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import { getAppKey, removeAppKey } from "./key";

const baseURL = "/api";

export { baseURL };

const service = axios.create({
  baseURL: baseURL,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const appKey = getAppKey();
    if (appKey && appKey !== "undefined") {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
      config.headers["Authorization"] = `Bearer ${appKey}`;
    } 
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeAppKey();
      router.push("/login");
    } else {
      ElMessage.error(error.response?.data?.msg || "其他错误");
    }
    return Promise.reject(error);
  }
);

export default service;

// 获取AppKey
export const getAppKey = () => {
    return sessionStorage.getItem("appKey");
};

// 设置AppKey
export const setAppKey = (key) => {
    sessionStorage.setItem("appKey", key);
};

// 删除AppKey
export const removeAppKey = () => {
    sessionStorage.removeItem("appKey");
};


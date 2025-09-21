// 获取AdminKey
export const getAdminKey = () => {
    return sessionStorage.getItem("adminKey");
};

// 设置AdminKey
export const setAdminKey = (key) => {
    sessionStorage.setItem("adminKey", key);
};

// 删除AdminKey
export const removeAdminKey = () => {
    sessionStorage.removeItem("adminKey");
};

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
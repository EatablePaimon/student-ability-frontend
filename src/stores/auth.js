import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth',{
    state:() => ({
        isAdmin: false,
        id: null,
    }),
    actions:{
        setAdminStatus(status){
            this.isAdmin = status;
        },
        setAdminId(id){
            this.id = id;
        }
    }
});
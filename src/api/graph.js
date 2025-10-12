import { getAppKey } from '@/utils/key'
import request from '@/utils/request'

export function post(data) {
    return request({
        url: '/graph',
        method: 'post',
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${getAppKey()}`
            },
        data: JSON.stringify(data)
    })
}

export function getlist(page, size) {
    return request({
        url: '/graph',
        method: 'get',
        params: { 
            page: page,
            pageSize: size
        }
    })
}

export function Delete(id) {
    return request({
        url: `/graph/${id}`,
        method: 'delete',
    })
}

export function getdetail(id) {
    return request({
        url: `/graph/${id}`,
        method: 'get',
        params: { 
            id:id,
        }
    })
}

export function getpermission(id,page,pageSize) {
    return request({
        url: `/sourcekey/permissions/${id}`,
        method: 'get',
        params: { 
            page:page,
            pageSize:pageSize
        }
    })
}
export function putpermission(data){
    return request({
        url:`/sourcekey/allow`,
        method:'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAppKey()}`
           },
        data: JSON.stringify(data)
    })
}

export function removepermission(data){
    return request({
        url:`/sourcekey/disallow`,
        method:'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAppKey()}`
           },
        data: JSON.stringify(data)
    })
}
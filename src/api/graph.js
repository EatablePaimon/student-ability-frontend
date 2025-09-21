import { getAdminKey, getAppKey } from '@/utils/key'
import request from '@/utils/request'

export function post(data) {
    return request({
        url: '/graph',
        method: 'post',
        headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${getAdminKey()}`
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
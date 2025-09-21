import request from '@/utils/request'

export function post(Key) {
    return request({
        url: '/login',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ app_key: Key })
    })
}

export function get() {
    return request({
        url: '/login',
        method: 'get',
        headers: { 'Content-Type': 'application/json' }
    })
}

export function put() {
    return request({
        url: '/login',
        method: 'put',
        headers: { 'Content-Type': 'application/json' }
    })
}

export function Delete() {
    return request({
        url: '/login',
        method: 'delete',
        headers: { 'Content-Type': 'application/json' }
    })
}
import request from '@/utils/request'

export function login(Key) {
    return request({
        url: '/login',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ app_key: Key })
    })
}
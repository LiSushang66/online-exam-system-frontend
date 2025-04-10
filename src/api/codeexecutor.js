import request from '@/utils/request'

// 获取执行密钥
export function getExecuteKey() {
  return request({
    url: '/code/getApiKey',
    method: 'get'
  })
}

// 执行代码
export function executeCode(data) {
  return request({
    url: '/code/execode',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

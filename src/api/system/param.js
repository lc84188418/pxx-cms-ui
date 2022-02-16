import request from '@/utils/request'

// 查询参数配置列表
export function listParam(query) {
  return request({
    url: '/system/param',
    method: 'get',
    params: query
  })
}

// 查询参数配置详细
export function getParam(configKey) {
  return request({
    url: '/system/param/' + configKey,
    method: 'get'
  })
}

// 修改参数配置
export function updateParam(data) {
  return request({
    url: '/system/param',
    method: 'put',
    data: data
  })
}

import request from '@/utils/request'

// 查询参数配置列表
export function listPage(query) {
  return request({
    url: '/system/page/page',
    method: 'get',
    params: query
  })
}

// 查询参数配置详细
export function getPage(configKey) {
  return request({
    url: '/system/page/page' + configKey,
    method: 'get'
  })
}

// 修改参数配置
export function updatePage(data) {
  return request({
    url: '/system/page/page',
    method: 'put',
    data: data
  })
}
export function listTemplate(id) {
  return request({
    url: '/system/page/template/' + id,
    method: 'get'
  })
}
export function updateTemplate(data) {
  return request({
    url: '/system/page/template',
    method: 'put',
    data: data
  })
}
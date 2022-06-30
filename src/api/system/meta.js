import request from '@/utils/request'

// 查询元数据列表
export function listMetaData(query) {
  return request({
    url: '/system/metadata',
    method: 'get',
    params: query
  })
}
// 获取所有元数据类型列表
export function listMetaType() {
  return request({
    url: '/system/metadata/typeList',
    method: 'get'
  })
}

// 查询元数据详细
export function getMetaData(pkId) {
  return request({
    url: '/system/metadata/' + pkId,
    method: 'get'
  })
}

// 添加元数据
export function addMetaData(data) {
  return request({
    url: '/system/metadata',
    method: 'post',
    data: data
  })
}

// 修改元数据
export function updateMetaData(data) {
  return request({
    url: '/system/metadata',
    method: 'put',
    data: data
  })
}
// 删除元数据
export function deleteMetaData(pkId) {
  return request({
    url: '/system/metadata/' + pkId,
    method: 'delete'
  })
}

import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/dictionary/xzqh/area',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getArea(areaId) {
  return request({
    url: '/dictionary/xzqh/area/' + praseStrEmpty(areaId),
    method: 'get'
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/dictionary/xzqh/area',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/dictionary/xzqh/area',
    method: 'put',
    data: data
  })
}

//删除区域
export function delArea(areaIds) {
  return request({
    url: '/dictionary/xzqh/area/' + areaIds,
    method: 'delete'
  })
}

// 区域状态修改
export function changeAreaStatus(pkAreaId, status) {
  const data = {
    pkAreaId,
    status
  }
  return request({
    url: '/dictionary/xzqh/area',
    method: 'put',
    data: data
  })
}


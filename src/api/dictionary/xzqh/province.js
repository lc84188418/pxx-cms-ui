import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询省份列表
export function listProvince(query) {
  return request({
    url: '/dictionary/xzqh/province',
    method: 'get',
    params: query
  })
}

// 查询省份详细
export function getProvince(provinceId) {
  return request({
    url: '/dictionary/xzqh/province/' + praseStrEmpty(provinceId),
    method: 'get'
  })
}

// 新增省份
export function addProvince(data) {
  return request({
    url: '/dictionary/xzqh/province',
    method: 'post',
    data: data
  })
}

// 修改省份
export function updateProvince(data) {
  return request({
    url: '/dictionary/xzqh/province',
    method: 'put',
    data: data
  })
}

//删除省份
export function delProvince(provinceId) {
  return request({
    url: '/dictionary/xzqh/province/' + provinceId,
    method: 'delete'
  })
}

// 省份状态修改
export function changeProvinceStatus(pkProvinceId, status) {
  const data = {
    pkProvinceId,
    status
  }
  return request({
    url: '/dictionary/xzqh/province',
    method: 'put',
    data: data
  })
}
//导出省份
export function exportProvince() {
  return request({
    url: '/dictionary/xzqh/province/export',
    method: 'get'
  })
}
//同步省份
export function syncProvinceData() {
  const query = {
    startRow: 0,
    limit: 100,
    level:1,
    updateStatus: 2
  }
  return request({
    url: '/dictionary/xzqh/python',
    method: 'get',
    params: query
  })
}
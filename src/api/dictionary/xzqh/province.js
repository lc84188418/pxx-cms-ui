import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询省份列表
export function listProvince(query) {
  return request({
    url: '/dictionary/province',
    method: 'get',
    params: query
  })
}

// 查询省份详细
export function getProvince(provinceId) {
  return request({
    url: '/dictionary/province/' + praseStrEmpty(provinceId),
    method: 'get'
  })
}

// 新增省份
export function addProvince(data) {
  return request({
    url: '/dictionary/province',
    method: 'post',
    data: data
  })
}

// 修改省份
export function updateProvince(data) {
  return request({
    url: '/dictionary/province',
    method: 'put',
    data: data
  })
}

//删除省份
export function delProvince(provinceId) {
  return request({
    url: '/dictionary/province/' + provinceId,
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
    url: '/dictionary/province',
    method: 'put',
    data: data
  })
}


import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// api接口查询城市列表，不会进行分页
export function apiCitys() {
  return request({
    url: '/dictionary/api/xzqh/citys',
    method: 'get'
  })
}

// 查询城市列表
export function listCity(query) {
  return request({
    url: '/dictionary/city',
    method: 'get',
    params: query
  })
}

// 查询城市详细
export function getCity(provinceId) {
  return request({
    url: '/dictionary/city/' + praseStrEmpty(provinceId),
    method: 'get'
  })
}

// 新增城市
export function addCity(data) {
  return request({
    url: '/dictionary/city',
    method: 'post',
    data: data
  })
}

// 修改城市
export function updateCity(data) {
  return request({
    url: '/dictionary/city',
    method: 'put',
    data: data
  })
}

//删除城市
export function delCity(provinceId) {
  return request({
    url: '/dictionary/city/' + provinceId,
    method: 'delete'
  })
}

// 城市状态修改
export function changeCityStatus(pkprovinceId, status) {
  const data = {
    pkprovinceId,
    status
  }
  return request({
    url: '/dictionary/city',
    method: 'put',
    data: data
  })
}


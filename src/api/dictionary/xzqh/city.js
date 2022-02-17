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
    url: '/dictionary/xzqh/city',
    method: 'get',
    params: query
  })
}

// 查询城市详细
export function getCity(cityId) {
  return request({
    url: '/dictionary/xzqh/city/' + praseStrEmpty(cityId),
    method: 'get'
  })
}

// 新增城市
export function addCity(data) {
  return request({
    url: '/dictionary/xzqh/city',
    method: 'post',
    data: data
  })
}

// 修改城市
export function updateCity(data) {
  return request({
    url: '/dictionary/xzqh/city',
    method: 'put',
    data: data
  })
}

//删除城市
export function delCity(cityId) {
  return request({
    url: '/dictionary/xzqh/city/' + cityId,
    method: 'delete'
  })
}

// 城市状态修改
export function changeCityStatus(pkCityId, status) {
  const data = {
    pkCityId,
    status
  }
  return request({
    url: '/dictionary/xzqh/city',
    method: 'put',
    data: data
  })
}


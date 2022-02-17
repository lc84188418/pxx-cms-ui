import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询街道列表
export function listStreet(query) {
  return request({
    url: '/dictionary/xzqh/street',
    method: 'get',
    params: query
  })
}

// 查询街道详细
export function getStreet(streetId) {
  return request({
    url: '/dictionary/xzqh/street/' + praseStrEmpty(streetId),
    method: 'get'
  })
}

// 新增街道
export function addStreet(data) {
  return request({
    url: '/dictionary/xzqh/street',
    method: 'post',
    data: data
  })
}

// 修改街道
export function updateStreet(data) {
  return request({
    url: '/dictionary/xzqh/street',
    method: 'put',
    data: data
  })
}

//删除街道
export function delStreet(streetIds) {
  return request({
    url: '/dictionary/xzqh/street/' + streetIds,
    method: 'delete'
  })
}

// 街道状态修改
export function changeStreetStatus(pkStreetId, status) {
  const data = {
    pkStreetId,
    status
  }
  return request({
    url: '/dictionary/xzqh/street',
    method: 'put',
    data: data
  })
}


import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询乡镇列表
export function listCounty(query) {
  return request({
    url: '/dictionary/xzqh/county',
    method: 'get',
    params: query
  })
}

// 查询乡镇详细
export function getCounty(countyId) {
  return request({
    url: '/dictionary/xzqh/county/' + praseStrEmpty(countyId),
    method: 'get'
  })
}

// 新增乡镇
export function addCounty(data) {
  return request({
    url: '/dictionary/xzqh/county',
    method: 'post',
    data: data
  })
}

// 修改乡镇
export function updateCounty(data) {
  return request({
    url: '/dictionary/xzqh/county',
    method: 'put',
    data: data
  })
}

//删除乡镇
export function delCounty(countyIds) {
  return request({
    url: '/dictionary/xzqh/county/' + countyIds,
    method: 'delete'
  })
}

// 乡镇状态修改
export function changeCountyStatus(pkCountyId, status) {
  const data = {
    pkCountyId,
    status
  }
  return request({
    url: '/dictionary/xzqh/county',
    method: 'put',
    data: data
  })
}

//导出
export function exportCounty() {
  return request({
    url: '/dictionary/xzqh/county/export',
    method: 'get'
  })
}
//同步数据
export function syncCountyData() {
  const query = {
    startRow: 0,
    limit: 100,
    level:5,
    updateStatus: 2
  }
  return request({
    url: '/dictionary/xzqh/python',
    method: 'get',
    params: query
  })
}
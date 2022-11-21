import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询登录日志列表
export function listLogin(query) {
  return request({
    url: '/system/log/login',
    method: 'get',
    params: query
  })
}

// 查询登录日志详细
export function getLogin(logId) {
  return request({
    url: '/system/log/login/' + praseStrEmpty(logId),
    method: 'get'
  })
}

//删除登录日志
export function delLogin(logId) {
  return request({
    url: '/system/log/login/' + logId,
    method: 'delete'
  })
}



import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询操作日志列表
export function listException(query) {
  return request({
    url: '/system/log/exception',
    method: 'get',
    params: query
  })
}

// 查询操作日志详细
export function getException(exceptionId) {
  return request({
    url: '/system/log/exception/' + praseStrEmpty(exceptionId),
    method: 'get'
  })
}

//删除操作日志
export function delException(exceptionId) {
  return request({
    url: '/system/log/exception/' + exceptionId,
    method: 'delete'
  })
}



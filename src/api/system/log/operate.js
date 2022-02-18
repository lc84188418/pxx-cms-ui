import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询操作日志列表
export function listOperate(query) {
  return request({
    url: '/system/log/operate',
    method: 'get',
    params: query
  })
}

// 查询操作日志详细
export function getOperate(operateId) {
  return request({
    url: '/system/log/operate/' + praseStrEmpty(operateId),
    method: 'get'
  })
}

//删除操作日志
export function delOperate(operateId) {
  return request({
    url: '/system/log/operate/' + operateId,
    method: 'delete'
  })
}



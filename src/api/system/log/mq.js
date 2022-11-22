import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询mq消费日志列表
export function listMqConsumer(query) {
  return request({
    url: '/mq/consumer',
    method: 'get',
    params: query
  })
}

// 查询mq消费日志详细
export function getMqConsumer(logId) {
  return request({
    url: '/mq/consumer/' + praseStrEmpty(logId),
    method: 'get'
  })
}

//删除mq消费日志
export function delMqConsumer(logId) {
  return request({
    url: '/mq/consumer/' + logId,
    method: 'delete'
  })
}


// 查询mq生产日志列表
export function listMqProducer(query) {
  return request({
    url: '/mq/producer',
    method: 'get',
    params: query
  })
}

// 查询mq生产日志详细
export function getMqProducer(logId) {
  return request({
    url: '/mq/producer/' + praseStrEmpty(logId),
    method: 'get'
  })
}

//删除mq生产日志
export function delMqProducer(logId) {
  return request({
    url: '/mq/producer/' + logId,
    method: 'delete'
  })
}
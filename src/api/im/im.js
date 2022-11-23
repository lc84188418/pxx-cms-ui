import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 通过用户名得到IM签名串
export function getUserSig(userId) {
  return request({
    url: '/im/common/getUserSig/' + userId,
    method: 'get',
  })
}
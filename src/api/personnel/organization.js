import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/organization/`

// 部门管理
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getList = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'GetList', params, config)
}
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}
export const softDelete = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}

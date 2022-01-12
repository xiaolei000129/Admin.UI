import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/role/`

// 角色管理
export const getRole = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getRoleListPage = (params, config = {}) => {
  params = params || {}
  return request.post(apiPrefix + 'GetPageList', params, config)
}
export const addRole = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}
export const editRole = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}
export const removeRole = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const batchRemoveRole = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}

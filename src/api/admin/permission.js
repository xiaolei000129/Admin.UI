import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/permission/`

// 权限管理
export const getPermissionList = (params, config = {}) => {
  return request.get(apiPrefix + 'GetList', { params: params, ...config })
}
export const removePermission = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const deletePermission = (params, config = {}) => {
  return request.delete(apiPrefix + 'Delete', { params: params, ...config })
}
export const getPermissions = (params, config = {}) => {
  return request.get(apiPrefix + 'GetPermissionList', { params: params, ...config })
}
export const getPermissionIds = (params, config = {}) => {
  return request.get(apiPrefix + 'GetRolePermissionList', { params: params, ...config })
}
export const GetTenantPermissionIds = (params, config = {}) => {
  return request.get(apiPrefix + 'GetTenantPermissionList', { params: params, ...config })
}
export const addRolePermission = (params, config = {}) => {
  return request.post(apiPrefix + 'Assign', params, config)
}
export const saveTenantPermissions = (params, config = {}) => {
  return request.post(apiPrefix + 'SaveTenantPermissions', params, config)
}

export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'AddGroup', params, config)
}
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'AddMenu', params, config)
}
export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + 'AddApi', params, config)
}
export const addDot = (params, config = {}) => {
  return request.post(apiPrefix + 'AddDot', params, config)
}

export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateGroup', params, config)
}
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateMenu', params, config)
}
export const updateApi = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateApi', params, config)
}
export const updateDot = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateDot', params, config)
}

export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'GetGroup', { params: params, ...config })
}
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'GetMenu', { params: params, ...config })
}
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + 'GetApi', { params: params, ...config })
}
export const getDot = (params, config = {}) => {
  return request.get(apiPrefix + 'GetDot', { params: params, ...config })
}

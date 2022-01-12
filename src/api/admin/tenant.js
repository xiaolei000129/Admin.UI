import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/tenant/`

// 租户管理
export const getTenant = (params, config = {}) => {
    return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getTenantListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'GetPageList', { params: params, ...config })
}
export const addTenant = (params, config = {}) => {
    return request.post(apiPrefix + 'Add', params, config)
}
export const editTenant = (params, config = {}) => {
    return request.put(apiPrefix + 'Update', params, config)
}
export const removeTenant = (params, config = {}) => {
    return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const batchRemoveTenant = (params, config = {}) => {
    return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
export const deleteTenant = (params, config = {}) => {
    return request.delete(apiPrefix + 'Delete', { params: params, ...config })
}
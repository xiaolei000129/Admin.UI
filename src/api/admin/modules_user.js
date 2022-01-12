import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/ModulesUser/`

// 用户管理
export const getUser = (params, config = {}) => {
    return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getUserListPage = (params, config = {}) => {
    return request.post(apiPrefix + 'GetPageList', params, config)
}
export const removeUser = (params, config = {}) => {
    return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const editUser = (params, config = {}) => {
    return request.put(apiPrefix + 'Update', params, config)
}
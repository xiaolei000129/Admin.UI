import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/employee/`

// 员工管理
export const getEmployee = (params, config = {}) => {
    return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getEmployeeListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'GetPageList', { params: params, ...config })
}
export const editEmployee = (params, config = {}) => {
    return request.put(apiPrefix + 'Update', params, config)
}
export const updateBasicEmployee = (params, config = {}) => {
    return request.put(apiPrefix + 'UpdateBasic', params, config)
}
export const addEmployee = (params, config = {}) => {
    return request.post(apiPrefix + 'Add', params, config)
}
export const removeEmployee = (params, config = {}) => {
    return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const batchRemoveEmployee = (params, config = {}) => {
    return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
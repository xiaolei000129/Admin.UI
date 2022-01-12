import request from '@/utils/request'
import scope from '../scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/LowCodeTableConfig/`

// 低代码管理配置
export const getLowCodeTableConfig = (params, config = {}) => {
    return request.get(apiPrefix + 'get', { params: params, config })
}
export const addLowCodeTableConfig = (params, config = {}) => {
    return request.post(apiPrefix + 'add', params, config)
}
export const getLowCodeTableConfigListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'getpagelist', params, config)
}
export const removeLowCodeTableConfig = (params, config = {}) => {
    return request.post(apiPrefix + 'delete', { params: params, config })
}
export const batchLowCodeTable = (params, config = {}) => {
    return request.delete(apiPrefix + 'batchDelete', params, ...config)
}
export const editLowCodeTableConfig = (params, config = {}) => {
    return request.put(apiPrefix + 'update', params, config)
}
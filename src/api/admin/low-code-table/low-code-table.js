import request from '@/utils/request'
import scope from '../scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/LowCodeTable/`

// 低代码管理
export const getLowCodeTable = (params, config = {}) => {
    console.log(params);
    return request.get(apiPrefix + 'get', { params: params, config })
}
export const addLowCodeTable = (params, config = {}) => {
    return request.post(apiPrefix + 'add', params, config)
}
export const getLowCodeTableListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'getpagelist', params, config)
}
export const getTableEntityList = (params, config = {}) => {
    return request.get(apiPrefix + 'gettableentitylist', params, config)
}
export const getColumnListByTableName = (params, config = {}) => {
    return request.get(apiPrefix + 'getcolumnlistbytablename', { params: params, config })
}
export const removeLowCodeTable = (params, config = {}) => {
    return request.delete(apiPrefix + 'delete', { params: params, ...config })
}
export const batchLowCodeTable = (params, config = {}) => {
    return request.post(apiPrefix + 'batchdelete', params, config)
}
export const editLowCodeTable = (params, config = {}) => {
    return request.put(apiPrefix + 'update', params, config)
}
export const generateLowCodeTable = (params, config = {}) => {
    return request.get(apiPrefix + 'generatecode', { params: params, config })
}
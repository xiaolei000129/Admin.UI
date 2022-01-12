import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/dictionarytype/`

// 数据字典类型管理
export const getPage = (params, config = {}) => {
    return request.get(apiPrefix + 'GetPageList', { params: params, ...config })
}
export const get = (params, config = {}) => {
    return request.get(apiPrefix + 'Get', { params: params, ...config })
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
export const batchSoftDelete = (params, config = {}) => {
    return request.put(apiPrefix + 'BatchSoftDelete', params, config)
}
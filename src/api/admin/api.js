import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/api/`

// 接口管理
export const getApi = (params, config = {}) => {
  return request.get(apiPrefix + 'Get', { params: params, ...config })
}
export const getApiList = (params, config = {}) => {
  return request.get(apiPrefix + 'GetList', { params: params, ...config })
}
export const removeApi = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const batchRemoveApi = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
export const editApi = (params, config = {}) => {
  return request.put(apiPrefix + 'Update', params, config)
}
export const addApi = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}
/**
 * 同步api
 */
export const syncApi = (params, config = {}) => {
  return request.post(apiPrefix + 'Sync', params, config)
}
export const getV2SwaggerJson = (params, config = {}) => {
  return request.get('/swagger/V2/swagger.json', { params: params, ...config })
}

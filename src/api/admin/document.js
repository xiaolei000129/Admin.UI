import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/document/`

// 文档管理
export const getDocuments = (params, config = {}) => {
  return request.get(apiPrefix + 'GetList', { params: params, ...config })
}
export const getDocumentImages = (params, config = {}) => {
  return request.get(apiPrefix + 'Getimagelist', { params: params, ...config })
}
export const getGroup = (params, config = {}) => {
  return request.get(apiPrefix + 'GetGroup', { params: params, ...config })
}
export const getMenu = (params, config = {}) => {
  return request.get(apiPrefix + 'GetMenu', { params: params, ...config })
}
export const getContent = (params, config = {}) => {
  return request.get(apiPrefix + 'GetContent', { params: params, ...config })
}
export const addGroup = (params, config = {}) => {
  return request.post(apiPrefix + 'AddGroup', params, config)
}
export const addMenu = (params, config = {}) => {
  return request.post(apiPrefix + 'AddMenu', params, config)
}
export const updateGroup = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateGroup', params, config)
}
export const updateMenu = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateMenu', params, config)
}
export const updateContent = (params, config = {}) => {
  return request.put(apiPrefix + 'UpdateContent', params, config)
}
export const removeDocument = (params, config = {}) => {
  return request.delete(apiPrefix + 'SoftDelete', { params: params, ...config })
}
export const deleteImage = (params, config = {}) => {
  return request.delete(apiPrefix + 'DeleteImage', { params: params, ...config })
}

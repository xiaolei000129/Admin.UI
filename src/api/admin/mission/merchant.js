import request from '@/utils/request'
import scope from '../scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/merchant/`

// 商家任务列表管理
export const getListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'GetMissionTypePageList', params, config)
}
export const remove = (params, config = {}) => {
    return request.delete(apiPrefix + 'DelMissionDetailById', { params: params, ...config })
}
export const edit = (params, config = {}) => {
    return request.post(apiPrefix + 'AddMissionDetail', params, config)
}
export const add = (params, config = {}) => {
    return request.post(apiPrefix + 'AddMissionDetail', params, config)
}
export const exposure = (params, config = {}) => {
    return request.post(apiPrefix + 'ExposureMissionById', params, config)
}
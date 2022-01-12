import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/UserBankCard/`

// 银行卡管理
export const get = (params, config = {}) => {
    return request.get(apiPrefix + 'GetUserBankCard', { params: params, ...config })
}
export const getListPage = (params, config = {}) => {
    return request.post(apiPrefix + 'GetUserBankCardPage', params, config)
}
export const remove = (params, config = {}) => {
    return request.delete(apiPrefix + 'UserBankCardDelete', { params: params, ...config })
}
export const edit = (params, config = {}) => {
    return request.post(apiPrefix + 'AddUserBankCardInfo', params, config)
}
import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/auth/`

// 授权

/**
 * 登录
 */
export const login = (params, config = {}) => {
  return request.post(apiPrefix + 'Login', params, { ...{ api: { auth: false }}, ...config })
}
export const refresh = (params, config = {}) => {
  return request.get(apiPrefix + 'Refresh', { params: params, ...config })
}
export const getVerifyCode = (params, config = {}) => {
  return request.get(apiPrefix + 'GetVerifyCode', { params: params, ...{ api: { auth: false }}, ...config })
}
export const getPassWordEncryptKey = (params, config = {}) => {
  return request.get(apiPrefix + 'GetPassWordEncryptKey', { params: params, ...{ api: { auth: false }}, ...config })
}
export const getLoginInfo = (params, config = {}) => {
  return request.get(apiPrefix + 'GetUserInfo', { params: params, ...config })
}
export const getCaptcha = (params, config = {}) => {
  return request.get(apiPrefix + 'GetCaptcha', { params: params, ...{ api: { auth: false }}, ...config })
}
export const checkCaptcha = (params, config = {}) => {
  return request.get(apiPrefix + 'CheckCaptcha', { params: params, ...{ api: { auth: false }}, ...config })
}

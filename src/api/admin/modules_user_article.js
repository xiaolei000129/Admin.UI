import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/Article/`

// 文章管理
export const get = (params, config = {}) => {
    return request.get(apiPrefix + 'GetArticleById', { params: params, ...config })
}
export const getListPage = (params, config = {}) => {
    return request.get(apiPrefix + 'ArticlePageList', params, config)
}
export const remove = (params, config = {}) => {
    return request.delete(apiPrefix + 'DeleteArticle', { params: params, ...config })
}
export const edit = (params, config = {}) => {
    return request.post(apiPrefix + 'EditArticleInfo', params, config)
}
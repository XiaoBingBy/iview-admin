import axios from '@/libs/api.request'

export const apiGetDiscList = (data) => {
  return axios.request({
    url: '/upms/dict/page',
    data: data,
    method: 'POST'
  })
}

export const apiAddDisc = (data) => {
  return axios.request({
    url: '/upms/dict',
    data: data,
    method: 'POST'
  })
}

export const apiUpdateDisc = (data) => {
  return axios.request({
    url: '/upms/dict',
    data: data,
    method: 'PUT'
  })
}

export const apiDeleteDict = (data) => {
  return axios.request({
    url: '/upms/dict/' + data,
    method: 'DELETE'
  })
}

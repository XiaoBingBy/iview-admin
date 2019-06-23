import axios from '@/libs/api.request'

export const getUserList = (data) => {
  return axios.request({
    url: '/upms/user/page',
    data: data,
    method: 'POST'
  })
}

export const apiAddUser = (data) => {
  return axios.request({
    url: '/upms/user',
    data: data,
    method: 'POST'
  })
}

export const apiUpdateUser = (data) => {
  return axios.request({
    url: '/upms/user',
    data: data,
    method: 'PUT'
  })
}

export const apiUserRolesInfo = (id) => {
  return axios.request({
    url: `/upms/user/userRolesInfo/${id}`,
    method: 'GET'
  })
}

export const apiDeleteUser = (data) => {
  return axios.request({
    url: '/upms/user/' + data,
    method: 'DELETE'
  })
}

import axios from '@/libs/api.request'

export const apiGetPermissionTree = () => {
  return axios.request({
    url: '/upms/permission/getPermissionTree',
    method: 'GET'
  })
}

export const apiAddPermission = (data) => {
  return axios.request({
    url: '/upms/permission',
    data: data,
    method: 'POST'
  })
}

export const apiUpdatePermission = (data) => {
  return axios.request({
    url: '/upms/permission',
    data: data,
    method: 'PUT'
  })
}

export const apiDeletePermissions = (data) => {
  return axios.request({
    url: '/upms/permission/' + data,
    method: 'DELETE'
  })
}

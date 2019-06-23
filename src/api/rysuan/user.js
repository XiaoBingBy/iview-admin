import axios from '@/libs/api.request'

export const userInfoPage = (data) => {
  return axios.request({
    url: '/rysuan/admin/user/userInfoPage',
    data: data,
    method: 'POST'
  })
}

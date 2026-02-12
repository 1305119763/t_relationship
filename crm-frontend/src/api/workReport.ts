import request from '@/utils/request'

export const getWorkReports = () => {
  return request({
    url: '/work-reports',
    method: 'get'
  })
}

export const createWorkReport = (data: any) => {
  return request({
    url: '/work-reports',
    method: 'post',
    data
  })
}

export const updateWorkReport = (id: number, data: any) => {
  return request({
    url: `/work-reports/${id}`,
    method: 'put',
    data
  })
}

export const deleteWorkReport = (id: number) => {
  return request({
    url: `/work-reports/${id}`,
    method: 'delete'
  })
}

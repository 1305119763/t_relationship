import request from '@/utils/request'

export const getTemplates = () => {
  return request({
    url: '/approvals/templates',
    method: 'get'
  })
}

export const createTemplate = (data: any) => {
  return request({
    url: '/approvals/templates',
    method: 'post',
    data
  })
}

export const getRequests = () => {
  return request({
    url: '/approvals/requests',
    method: 'get'
  })
}

export const createRequest = (data: any) => {
  return request({
    url: '/approvals/requests',
    method: 'post',
    data
  })
}

export const approveRequest = (id: number, data: any) => {
  return request({
    url: `/approvals/requests/${id}/approve`,
    method: 'post',
    data
  })
}

export const rejectRequest = (id: number, data: any) => {
  return request({
    url: `/approvals/requests/${id}/reject`,
    method: 'post',
    data
  })
}

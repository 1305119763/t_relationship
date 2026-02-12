import request from '@/utils/request'

export const getWorkOrders = () => {
  return request({
    url: '/work-orders',
    method: 'get'
  })
}

export const createWorkOrder = (data: any) => {
  return request({
    url: '/work-orders',
    method: 'post',
    data
  })
}

export const updateWorkOrder = (id: number, data: any) => {
  return request({
    url: `/work-orders/${id}`,
    method: 'put',
    data
  })
}

export const deleteWorkOrder = (id: number) => {
  return request({
    url: `/work-orders/${id}`,
    method: 'delete'
  })
}

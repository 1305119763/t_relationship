import request from '@/utils/request'

export const getCustomers = () => {
  return request({
    url: '/customers',
    method: 'get'
  })
}

export const createCustomer = (data: any) => {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}

export const updateCustomer = (id: number, data: any) => {
  return request({
    url: `/customers/${id}`,
    method: 'put',
    data
  })
}

export const deleteCustomer = (id: number) => {
  return request({
    url: `/customers/${id}`,
    method: 'delete'
  })
}

import request from '@/utils/request'

export const getSalesFunnel = () => {
  return request({
    url: '/reports/funnel',
    method: 'get'
  })
}

export const getSalesTrend = () => {
  return request({
    url: '/reports/trend',
    method: 'get'
  })
}

export const getCustomerStats = () => {
  return request({
    url: '/reports/customer-stats',
    method: 'get'
  })
}

import request from '@/utils/request'

export const getSchedules = () => {
  return request({
    url: '/schedules',
    method: 'get'
  })
}

export const createSchedule = (data: any) => {
  return request({
    url: '/schedules',
    method: 'post',
    data
  })
}

export const updateSchedule = (id: number, data: any) => {
  return request({
    url: `/schedules/${id}`,
    method: 'put',
    data
  })
}

export const deleteSchedule = (id: number) => {
  return request({
    url: `/schedules/${id}`,
    method: 'delete'
  })
}

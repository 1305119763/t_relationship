import request from '@/utils/request'

export const getTasks = () => {
  return request({
    url: '/tasks',
    method: 'get'
  })
}

export const createTask = (data: any) => {
  return request({
    url: '/tasks',
    method: 'post',
    data
  })
}

export const updateTask = (id: number, data: any) => {
  return request({
    url: `/tasks/${id}`,
    method: 'put',
    data
  })
}

export const deleteTask = (id: number) => {
  return request({
    url: `/tasks/${id}`,
    method: 'delete'
  })
}

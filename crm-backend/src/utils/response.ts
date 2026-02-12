import { Response } from 'express'

const defaultSuccessMessage = 'success'
const defaultErrorMessage = '请求失败'

export function success(res: Response, data: any = null, message: string = defaultSuccessMessage) {
  return res.status(200).json({
    code: 0,
    message,
    data
  })
}

export function successCreated(res: Response, data: any = null, message: string = '创建成功') {
  return res.status(201).json({
    code: 0,
    message,
    data
  })
}

export function fail(res: Response, code: number, message: string = defaultErrorMessage, data: any = null) {
  const httpStatus = code >= 400 && code < 600 ? code : 500
  return res.status(httpStatus).json({
    code,
    message,
    data
  })
}

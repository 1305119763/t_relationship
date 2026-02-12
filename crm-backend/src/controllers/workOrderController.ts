import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getWorkOrders = async (req: AuthRequest, res: Response) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    success(res, workOrders)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createWorkOrder = async (req: AuthRequest, res: Response) => {
  const { customerId, orderId, type, title, content, status, mobileAttendance, signInAddress, signInRange } = req.body
  const creatorId = req.user.id

  const customerIdNum = typeof customerId === 'string' ? parseInt(customerId, 10) : Number(customerId)
  if (Number.isNaN(customerIdNum) || customerIdNum <= 0) {
    return fail(res, 400, '关联客户无效，请选择系统中的客户（customerId 必须为有效客户 id）', null)
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerIdNum }
    })
    if (!customer) {
      return fail(res, 400, '关联客户不存在，请先选择已存在的客户', null)
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        customerId: customerIdNum,
        orderId: orderId || null,
        type,
        title,
        content,
        status,
        mobileAttendance: mobileAttendance ?? '1',
        signInAddress,
        signInRange,
        creatorId
      }
    })
    successCreated(res, workOrder)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateWorkOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { customerId, orderId, type, title, content, status, mobileAttendance, signInAddress, signInRange, workOrderStatus } = req.body

  try {
    const workOrder = await prisma.workOrder.update({
      where: { id: Number(id) },
      data: {
        customerId,
        orderId,
        type,
        title,
        content,
        status,
        mobileAttendance,
        signInAddress,
        signInRange,
        workOrderStatus
      }
    })
    success(res, workOrder)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteWorkOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.workOrder.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

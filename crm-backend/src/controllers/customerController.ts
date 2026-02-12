import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    success(res, customers)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const getCustomer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: {
        contacts: true,
        opportunities: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    if (!customer) {
      return fail(res, 404, '客户不存在', null)
    }
    success(res, customer)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createCustomer = async (req: AuthRequest, res: Response) => {
  const { name, industry, status } = req.body
  const ownerId = req.user.id

  try {
    const customer = await prisma.customer.create({
      data: {
        name,
        industry,
        status,
        ownerId
      }
    })
    successCreated(res, customer)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateCustomer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { name, industry, status } = req.body

  try {
    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        industry,
        status
      }
    })
    success(res, customer)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.customer.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createFollowUp = async (req: AuthRequest, res: Response) => {
  const { type, content, customerId, contact, customerStatus, createNextTask, followUpTime } = req.body
  const creatorId = req.user.id

  try {
    const followUp = await prisma.followUp.create({
      data: {
        type,
        content,
        customerId,
        contact,
        customerStatus,
        createNextTask,
        followUpTime,
        creatorId
      }
    })
    successCreated(res, followUp)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const getCustomerFollowUps = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    const followUps = await prisma.followUp.findMany({
      where: { customerId: Number(id) },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        followUpTime: 'desc'
      }
    })
    success(res, followUps)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

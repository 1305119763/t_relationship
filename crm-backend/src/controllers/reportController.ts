import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, fail } from '../utils/response'

export const getSalesFunnel = async (req: AuthRequest, res: Response) => {
  try {
    const funnel = await prisma.opportunity.groupBy({
      by: ['stage'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    })

    const data = funnel.map(item => ({
      name: item.stage,
      value: item._count.id,
      amount: item._sum.amount || 0
    }))
    success(res, data)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const getSalesTrend = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date()
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6))

    const opportunities = await prisma.opportunity.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      select: {
        createdAt: true,
        amount: true
      }
    })

    const trend: Record<string, number> = {}
    opportunities.forEach(op => {
      const month = op.createdAt.toISOString().slice(0, 7)
      trend[month] = (trend[month] || 0) + op.amount
    })

    const data = Object.keys(trend).sort().map(month => ({
      month,
      amount: trend[month]
    }))
    success(res, data)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const getCustomerStats = async (req: AuthRequest, res: Response) => {
  try {
    const total = await prisma.customer.count()
    const newCustomers = await prisma.customer.count({
      where: { status: 'new' }
    })
    const active = await prisma.customer.count({
      where: { status: 'active' }
    })
    success(res, {
      total,
      new: newCustomers,
      active
    })
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

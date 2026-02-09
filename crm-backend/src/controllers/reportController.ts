import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'

export const getSalesFunnel = async (req: AuthRequest, res: Response) => {
  try {
    // Group opportunities by stage
    const funnel = await prisma.opportunity.groupBy({
      by: ['stage'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    })
    
    // Format for ECharts
    const data = funnel.map(item => ({
      name: item.stage,
      value: item._count.id,
      amount: item._sum.amount || 0
    }))

    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getSalesTrend = async (req: AuthRequest, res: Response) => {
  try {
    // Get last 6 months trend
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

    // Group by month
    const trend: Record<string, number> = {}
    opportunities.forEach(op => {
      const month = op.createdAt.toISOString().slice(0, 7) // YYYY-MM
      trend[month] = (trend[month] || 0) + op.amount
    })

    const data = Object.keys(trend).sort().map(month => ({
      month,
      amount: trend[month]
    }))

    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
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

    res.json({
      total,
      new: newCustomers,
      active
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

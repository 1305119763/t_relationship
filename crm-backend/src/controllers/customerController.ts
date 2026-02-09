import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'

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
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
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
      return res.status(404).json({ message: 'Customer not found' })
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
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
    res.status(201).json(customer)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
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
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.customer.delete({
      where: { id: Number(id) }
    })
    res.json({ message: 'Customer deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

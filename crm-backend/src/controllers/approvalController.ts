import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'

// Templates
export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const templates = await prisma.approvalTemplate.findMany()
    res.json(templates)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const createTemplate = async (req: AuthRequest, res: Response) => {
  const { name, description, steps } = req.body
  try {
    const template = await prisma.approvalTemplate.create({
      data: {
        name,
        description,
        steps: JSON.stringify(steps)
      }
    })
    res.status(201).json(template)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Requests
export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.approvalRequest.findMany({
      include: {
        template: true,
        applicant: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const createRequest = async (req: AuthRequest, res: Response) => {
  const { templateId, data } = req.body
  const applicantId = req.user.id

  try {
    const request = await prisma.approvalRequest.create({
      data: {
        templateId,
        applicantId,
        data: JSON.stringify(data),
        status: 'pending',
        currentStep: 0
      }
    })
    res.status(201).json(request)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const approveRequest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const approverId = req.user.id
  const { comment } = req.body

  try {
    await prisma.$transaction([
      prisma.approvalRequest.update({
        where: { id: Number(id) },
        data: {
          currentStep: { increment: 1 },
          status: 'approved'
        }
      }),
      prisma.approvalLog.create({
        data: {
          requestId: Number(id),
          approverId,
          action: 'approve',
          comment
        }
      })
    ])

    res.json({ message: 'Approved successfully', status: 'approved' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const rejectRequest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const approverId = req.user.id
  const { comment } = req.body

  try {
    await prisma.$transaction([
      prisma.approvalRequest.update({
        where: { id: Number(id) },
        data: {
          status: 'rejected'
        }
      }),
      prisma.approvalLog.create({
        data: {
          requestId: Number(id),
          approverId,
          action: 'reject',
          comment
        }
      })
    ])

    res.json({ message: 'Rejected successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

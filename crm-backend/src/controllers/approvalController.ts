import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

// Templates
export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const templates = await prisma.approvalTemplate.findMany()
    success(res, templates)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
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
    successCreated(res, template)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
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
    success(res, requests)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
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
    successCreated(res, request)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
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
    success(res, { status: 'approved' }, '审批通过')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
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
    success(res, null, '已驳回')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

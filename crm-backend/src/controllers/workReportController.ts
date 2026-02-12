import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getWorkReports = async (req: AuthRequest, res: Response) => {
  try {
    const workReports = await prisma.workReport.findMany({
      include: {
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
    success(res, workReports)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createWorkReport = async (req: AuthRequest, res: Response) => {
  const { reportType, reportDate, workSummary, fileAttachment, imageUpload, approver, ccMembers } = req.body
  const creatorId = req.user.id

  try {
    const workReport = await prisma.workReport.create({
      data: {
        reportType,
        reportDate,
        workSummary,
        fileAttachment,
        imageUpload,
        approver,
        ccMembers: JSON.stringify(ccMembers || []),
        creatorId
      }
    })
    successCreated(res, workReport)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateWorkReport = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { reportType, reportDate, workSummary, fileAttachment, imageUpload, approver, ccMembers, status } = req.body

  try {
    const workReport = await prisma.workReport.update({
      where: { id: Number(id) },
      data: {
        reportType,
        reportDate,
        workSummary,
        fileAttachment,
        imageUpload,
        approver,
        ccMembers: ccMembers ? JSON.stringify(ccMembers) : undefined,
        status
      }
    })
    success(res, workReport)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteWorkReport = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.workReport.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
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
    success(res, announcements)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  const { category, title, recipient, content } = req.body
  const creatorId = req.user.id

  try {
    const announcement = await prisma.announcement.create({
      data: {
        category,
        title,
        recipient,
        content,
        creatorId
      }
    })
    successCreated(res, announcement)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { category, title, recipient, content } = req.body

  try {
    const announcement = await prisma.announcement.update({
      where: { id: Number(id) },
      data: {
        category,
        title,
        recipient,
        content
      }
    })
    success(res, announcement)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.announcement.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

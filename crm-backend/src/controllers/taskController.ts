import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
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
    success(res, tasks)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, startTime, endTime, priority, businessType, businessValue, description, attachment, responsiblePerson } = req.body
  const creatorId = req.user.id

  try {
    const task = await prisma.task.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority,
        businessType,
        businessValue,
        description,
        attachment,
        responsiblePerson,
        creatorId
      }
    })
    successCreated(res, task)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { title, startTime, endTime, priority, businessType, businessValue, description, attachment, responsiblePerson, status } = req.body

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        priority,
        businessType,
        businessValue,
        description,
        attachment,
        responsiblePerson,
        status
      }
    })
    success(res, task)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.task.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

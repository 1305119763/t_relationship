import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

export const getSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
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
        startTime: 'asc'
      }
    })
    success(res, schedules)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const createSchedule = async (req: AuthRequest, res: Response) => {
  const { title, startTime, endTime, urgency, businessType, businessValue, description, status, autoEnd, taskTag, reminder } = req.body
  const creatorId = req.user.id

  try {
    const schedule = await prisma.schedule.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        urgency,
        businessType,
        businessValue,
        description,
        status,
        autoEnd,
        taskTag,
        reminder,
        creatorId
      }
    })
    successCreated(res, schedule)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const updateSchedule = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { title, startTime, endTime, urgency, businessType, businessValue, description, status, autoEnd, taskTag, reminder } = req.body

  try {
    const schedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: {
        title,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        urgency,
        businessType,
        businessValue,
        description,
        status,
        autoEnd,
        taskTag,
        reminder
      }
    })
    success(res, schedule)
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  try {
    await prisma.schedule.delete({
      where: { id: Number(id) }
    })
    success(res, null, '删除成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma'
import { success, successCreated, fail } from '../utils/response'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return fail(res, 400, '用户已存在', null)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    successCreated(res, { id: user.id, email: user.email, name: user.name }, '注册成功')
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return fail(res, 400, '邮箱或密码错误', null)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return fail(res, 400, '邮箱或密码错误', null)
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
    success(res, { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (error) {
    fail(res, 500, '服务器错误', null)
  }
}

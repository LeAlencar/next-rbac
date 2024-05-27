import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string().min(3).max(255),
          email: z.string().email(),
          password: z.string().min(6).max(255),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userExists) {
        return reply.status(400).send({
          message: 'User already exists',
        })
      }
      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      })

      return reply.status(201).send()
    }
  )
}

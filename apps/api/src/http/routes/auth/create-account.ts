import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string().min(3).max(255),
          email: z.string().email(),
          password: z.string().min(8).max(255),
        }),
      },
    },
    () => {
      return 'User created!'
    },
  )
}
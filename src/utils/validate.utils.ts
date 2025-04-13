import { ZodSchema } from 'zod'

export const validateUser = async <T>(schema: ZodSchema, data: any): Promise<T> => {
  return schema.parseAsync(data)
}

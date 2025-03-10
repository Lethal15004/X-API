import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

/**
 * Middleware chạy validation bằng Zod
 * @param schema - Schema của Zod để validate
 */
export const validateRequest =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req[source])
    if (!result.success) {
      const errors = result.error.format() // 📌 Format lỗi từ Zod
      let firstError = 'Validation failed' // 🛠 Giá trị mặc định

      for (const error of Object.values(errors)) {
        if (typeof error === 'object' && '_errors' in error && Array.isArray(error._errors)) {
          firstError = error._errors[0] // 🔥 Lấy lỗi đầu tiên
          break
        }
      }

      res.status(400).json({ success: false, message: firstError })
      return
    }
    next()
  }
export default validateRequest

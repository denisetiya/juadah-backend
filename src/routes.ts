import type { Express } from 'express'
import type AuthHandler from './auth/handler'
import { loginSchema } from './auth/schema'
import multer from './lib/upload'
import { deserializeToken } from './middlewares/deserializeToken'
import formDataParse from './middlewares/formDataParser'
import requiredLogin from './middlewares/requiredLogin'
import sanitizeInput from './middlewares/sanitizeInput'
import { validateInput } from './middlewares/validateInput'
import type ProductHandler from './product/handler'
import { createProduct, updateProduct } from './product/schema'
import type UserHandler from './user/handler'
import { createUserSchema } from './user/schema'

interface Handler {
  auth: AuthHandler
  user: UserHandler
  product: ProductHandler
}

export default function routes(app: Express, handler: Handler) {
  app.use(sanitizeInput)
  app.post(
    '/api/register',
    //@ts-ignore
    validateInput(createUserSchema),
    handler.auth.registerUser,
  )
  app.post('/api/login', validateInput(loginSchema), handler.auth.login)
  app.get('/api/refresh', handler.auth.refreshToken)

  app.use(deserializeToken)
  app.use(requiredLogin)
  app.get('/api/users', handler.user.getCurrentUser)
  app.get('/api/users/:id', handler.user.getUserById)

  app.post(
    '/api/products',
    formDataParse(multer.array('images', 5)),
    validateInput(createProduct),
    handler.product.createProduct,
  )
  app.get('/api/products', handler.product.getProducts)
  app.put(
    '/api/products/:id',
    formDataParse(multer.array('images', 5)),
    validateInput(updateProduct),
    handler.product.updateProductById,
  )
}

import cookieParser from 'cookie-parser'
import express from 'express'
import routes from './routes'
import 'dotenv/config'
import cors from 'cors'
import connection from '../db/connection'
import AuthHandler from './auth/handler'
import AuthRepository from './auth/repository'
import AuthService from './auth/service'
import ProductHandler from './product/handler'
import ProductRepository from './product/repository'
import ProductService from './product/service'
import UserHandler from './user/handler'
import UserSerivce from './user/service'

const app = express()
const port = process.env.SERVER_PORT

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(express.json())
app.use(cookieParser())

const authRepo = new AuthRepository(connection)
const authService = new AuthService(authRepo)
const authHandler = new AuthHandler(authService)

const userService = new UserSerivce(authRepo)
const userHandler = new UserHandler(userService)

const productRepo = new ProductRepository(connection)
const productService = new ProductService(productRepo)
const productHandler = new ProductHandler(productService)

app.listen(port, () => {
  routes(app, { auth: authHandler, user: userHandler, product: productHandler })
  console.info(`Server running at port ${port}`)
})

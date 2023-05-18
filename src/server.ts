import express from 'express'
import { DataSource } from 'typeorm'

import { SERVER_PORT } from './constants'
import { mainDataSource } from './data-source'
import { AuthController } from './controllers/auth.controller'
import bodyParser from 'body-parser'
import { userRouter } from './routers/user.router'

const app = express()

const authController = new AuthController(mainDataSource)

function bindControllerMethod<T>(controller: T, methodName: keyof T) {
  if (typeof controller[methodName] === 'function') {
    return (controller[methodName] as Function).bind(controller)
  }
}

function startServer() {
  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/', (req, res) => {
      res.send('Hello World!')
    })
    .post('/token', bindControllerMethod(authController, 'issueToken'))
    .use('/users', userRouter)
    .listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`)
    })
}

mainDataSource.initialize().then(startServer)

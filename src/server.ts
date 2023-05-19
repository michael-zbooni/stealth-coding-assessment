import express from 'express'

import { SERVER_PORT } from './constants'
import { mainDataSource } from './data-source'
import { AuthController } from './controllers/auth.controller'
import bodyParser from 'body-parser'
import { userRouter } from './routers/user.router'
import { logger } from './logger'

const app = express()

const authController = new AuthController(mainDataSource)

function bindControllerMethod<T>(controller: T, methodName: keyof T) {
  return (controller[methodName] as express.RequestHandler).bind(controller)
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
      logger.info(`Server running on port ${SERVER_PORT}`)

      if (process.argv.includes('--debug')) {
        logger.debug('Debug enabled: to attach debugger, use process ID: ', process.pid)
      }
    })
}

mainDataSource.initialize().then(startServer)

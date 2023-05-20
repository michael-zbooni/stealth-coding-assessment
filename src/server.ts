import express from 'express'

import { SERVER_PORT } from './config'
import { mainDataSource } from './data-source'
import { AuthController } from './controllers/auth.controller'
import bodyParser from 'body-parser'
import { userRouter } from './routers/user.router'
import { logger } from './logger'

const app = express()

function startServer() {
  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/', async (req, res) => {
      res.send(/* html */ `
        <html>
          <body>
            <a href="https://github.com/myknbani/stealth-coding-assessment">Go here for instructions</a>
          </body>
        </html>
      `)
    })
    .post('/token', new AuthController(mainDataSource).handle('issueToken'))
    .use('/users', userRouter)
    .listen(SERVER_PORT, () => {
      logger.info(`Server running on port ${SERVER_PORT}`)

      if (process.argv.includes('--debug')) {
        logger.debug('Debug enabled: to attach debugger, use process ID: ', process.pid)
      }
    })
}

mainDataSource.initialize().then(startServer)

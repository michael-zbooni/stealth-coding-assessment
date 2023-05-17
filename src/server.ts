import express from 'express'
import { DataSource } from 'typeorm'

import { SERVER_PORT } from './constants'
import { mainDataSource } from './data-source'
import { AuthService } from './services/auth.service'
import bodyParser from 'body-parser'

const app = express()

const authService = new AuthService(mainDataSource)

function startServer() {
  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/', (req, res) => {
      res.send('Hello World!')
    })
    .get('/authorize', authService.temporary.bind(authService))
    .get('/oauth/callback', (request, response) => {
      response.json({ ok: true })
    })
    .post('/token', authService.tokenTemporary.bind(authService))
    .listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`)
    })
}

mainDataSource.initialize().then(startServer)

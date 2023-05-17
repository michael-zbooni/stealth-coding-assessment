import express from 'express'
import { DataSource } from 'typeorm'

import { SERVER_PORT, postgresConfig } from './constants'

const app = express()
const mainDataSource = new DataSource(postgresConfig)

function startServer() {
  app
    .get('/', (req, res) => {
      res.send('Hello World!')
    })
    .listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`)
    })
}

mainDataSource.initialize().then(startServer)

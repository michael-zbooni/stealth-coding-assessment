import express from 'express'

import { SERVER_PORT } from './constants'

const app = express()

app
  .get('/', (req, res) => {
    res.send('Hello World!')
  })
  .listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`)
  })

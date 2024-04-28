// eslint-disable-next-line no-console
import express from 'express'
import { COLSE_DB, CONNECT_DB, GET_DB } from '~/config/config.mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment'

const START_SERVER = () => {
  const app = express()

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.get('/', async (req, res) => {
    res.send('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    console.log(`3. Hello ${env.AUTHOR}, I am running at http://${ hostname }:${ port }/`)
  })
  //thực hiện các tác vụ cleanup trước khi dừng hẵn server
  // thư viện thay thế cho process.on ...
  exitHook(() => {
    console.log('4. Disconnecting DB...')
    COLSE_DB()
    console.log('5. Disconnected DB...')
  })
}

// IIFE structure
(
  async () => {
    try {
      console.log('1. Connecting to mongoDb Atlas!')
      await CONNECT_DB()
      console.log('2. Connected to mongoDb Atlas!')
      START_SERVER()
    } catch (error) {
      console.error(error)
      process.exit(0)
    }
  }
)()

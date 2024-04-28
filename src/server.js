// eslint-disable-next-line no-console
import express from 'express'
import { CLOSE_DB, CONNECT_DB, GET_DB } from '~/config/config.mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment'
import { API_V1s } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';

const HOST = env.APP_HOST
const PORT = env.APP_PORT
const AUTHOR = env.AUTHOR

const START_SERVER = () => {
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  //use APIs v1
  app.use('/v1', API_V1s)

  //middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(PORT, HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, I am running at http://${ HOST }:${ PORT }/`)
  })
  //thực hiện các tác vụ cleanup trước khi dừng hẵn server
  // thư viện thay thế cho process.on ...
  exitHook(() => {
    console.log('4. Disconnecting DB...')
    CLOSE_DB()
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

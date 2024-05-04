import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {boardRoute} from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'

const Router = express.Router()

Router.get('/status', (req, res, next) => {
    res.status(StatusCodes.OK).json({
        message: "API V1 are ready to use!",
        status: StatusCodes.OK
    })
})

//board API
Router.use('/boards', boardRoute)
//column API
Router.use('/columns', columnRoute)
//card API
Router.use('/cards', cardRoute)

export const API_V1s = Router
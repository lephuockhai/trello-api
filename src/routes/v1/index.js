import express from 'express'
import { StatusCodes } from 'http-status-codes'
import {boardRoutes} from './boardRoutes';

const Router = express.Router()

Router.get('/status', (req, res, next) => {
    res.status(StatusCodes.OK).json({
        message: "API V1 already to use!",
        status: StatusCodes.OK
    })
})

//board API
Router.use('/boards', boardRoutes)

export const API_V1s = Router
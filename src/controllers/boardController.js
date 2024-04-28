// Controller, Where controll data , directional to services
// before that, validate success and pass to controller

import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError'

const createNew = async (req, res, next) => {
    try {
        console.log('body::::',req.body)
        console.log('query::::',req.query)
        console.log('params::::',req.params)
        console.log('files::::',req.files)
        console.log('cookies::::',req.cookies)
        console.log('jwtDecoded::::',req.jwtDecoded)
        
        //directional data to services level

        //after received data then response to Client
        // throw new ApiError(StatusCodes.BAD_GATEWAY, 'bad request')

        res.status(StatusCodes.CREATED).json({
            message: "PORT from Controller: API create new board",
            status: StatusCodes.CREATED
        })
    } catch (error) { next(error) }
}

export const boardController = {
    createNew
}
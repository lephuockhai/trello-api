// Controller, Where controll data , directional to services
// before that, validate success and pass to controller

import { StatusCodes } from 'http-status-codes'

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

        res.status(StatusCodes.CREATED).json({
            message: "PORT from Controller: API create new board",
            status: StatusCodes.CREATED
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            errors: error.message
        })
    }
}

export const boardController = {
    createNew
}
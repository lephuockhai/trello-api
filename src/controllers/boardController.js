// Controller, Where controll data , directional to services
// before that, validate success and pass to controller

import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'


const createNew = async (req, res, next) => {
    try {
        // console.log('body::::',req.body)
        // console.log('query::::',req.query)
        // console.log('params::::',req.params)
        // console.log('files::::',req.files)
        // console.log('cookies::::',req.cookies)
        // console.log('jwtDecoded::::',req.jwtDecoded)
        
        //directional data to services level
        const createdBoard = await boardService.createNew(req.body)

        //after received data then response to Client
        // throw new ApiError(StatusCodes.BAD_GATEWAY, 'bad request')

        res.status(StatusCodes.CREATED).json(createdBoard) // khi có dữ liệu từ services
    } catch (error) { next(error) } // nếu bị lỗi trả về error tập trung
}

export const boardController = {
    createNew
}
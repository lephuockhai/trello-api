// Controller, Where controll data , directional to services
// before that, validate success and pass to controller

import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'


const createNew = async (req, res, next) => {
    try {
        //directional data to services level
        const createdBoard = await boardService.createNew(req.body)

        //after received data then response to Client
        // throw new ApiError(StatusCodes.BAD_GATEWAY, 'bad request')

        res.status(StatusCodes.CREATED).json(createdBoard) // khi có dữ liệu từ services
    } catch (error) { next(error) } // nếu bị lỗi trả về error tập trung
}
const getDetails = async (req, res, next) => {
    try {
        // console.log('params::::',req.params)
        const boardId =  req.params.id
        //advance sẽ lấy board của 1 user cụ thể ra theo permission
        //directional data to services level
        const board = await boardService.getDetails(boardId)

        //after received data then response to Client
        // throw new ApiError(StatusCodes.BAD_GATEWAY, 'bad request')

        res.status(StatusCodes.OK).json(board) // khi có dữ liệu từ services
    } catch (error) { next(error) } // nếu bị lỗi trả về error tập trung
}

const updateColumnIds = async (req, res, next) => {
    try {
        const boardId =  req.params.id

        const updateBoard = await boardService.updateColumnIds(boardId, req.body)

        res.status(StatusCodes.OK).json(updateBoard)
    } catch (error) { next(error) }
}   

export const boardController = {
    createNew,
    getDetails,
    updateColumnIds
}
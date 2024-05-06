import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
    try {
        const createdColumn = await columnService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdColumn)
    } catch (error) { next(error) } 
}

const updateCardOrderIds = async (req, res, next) => {
    try {
        const columnId = req.params.id 
        const updateColumn = columnService.updateCardOrderIds(columnId, req.body)
        res.status(StatusCodes.OK).json({updateColumn})
    } catch (error) { next(error) }
}

export const columnController = {
    createNew,
    updateCardOrderIds
}
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
    try {
        const newColumn = {
            ...reqBody
        }

        const createdColumn = await columnModel.createNew(newColumn)
        const getNewColumn = await columnModel.findById(createdColumn.insertedId)
        
        if (getNewColumn) {
            getNewColumn.cards = []

            await boardModel.pushColumnorderIds(getNewColumn)
        }
        return getNewColumn
    } catch (error) {
        throw error
    }
}
const updateCardOrderIds = async (columnId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            createdAt: Date.now()
        }
    
        const updateColumn = columnModel.update(columnId, updateData)
    
        return updateColumn
    } catch (error) { throw error }
}

const deleteColumn = async (columnId) => {
    try {

        const targetColumn = await columnModel.findById(columnId)

        if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')

        //delete column
        await columnModel.deleteOneById(columnId)

        //delete card of column  s
        await cardModel.deleteManyByColumnId(columnId)

        //delete column from columnOrderIds of boards
        await boardModel.pullColumnorderIds(targetColumn)

        return {deleteResult: 'Column and its Cards deleted successfully'}
    } catch (error) {throw error}
}

export const columnService = {
    createNew,
    updateCardOrderIds,
    deleteColumn
}
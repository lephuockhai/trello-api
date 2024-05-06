import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

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
    
        const updateColumn = columnModel.updateCardOrderIds(columnId, updateData)
    
        return updateColumn
    } catch (error) { throw error }
}

export const columnService = {
    createNew,
    updateCardOrderIds
}
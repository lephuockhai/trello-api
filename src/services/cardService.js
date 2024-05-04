import { ObjectId } from 'mongodb'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
    try {
        const newCard = {
            ...reqBody
        } 

        const createdCard = await cardModel.createNew(newCard)
        const getNewCard = await cardModel.findById(createdCard.insertedId)
        
        if (getNewCard) {
            
            await columnModel.pushCardorderIds(getNewCard)
        }
        return getNewCard
    } catch (error) {
        throw error
    }
}

export const cardService = {
    createNew
}
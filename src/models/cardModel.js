import Joi from 'joi'
import { GET_DB } from '~/config/config.mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

//validation dữ liệu trước khi insert vào model
const validateBeforeCreate = async (data) => {
    return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try { 
        const validData = await validateBeforeCreate(data)
        const newCardToAdd = {
            ...validData,
            boardId: new ObjectId(validData.boardId),
            columnId: new ObjectId(validData.columnId)
        }
        return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
    } catch (error) { throw new Error(error) } //có new Error để trả về stack trace
}

const findById = async (id) => {
    try {
        return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(id) 
        })
    } catch (error) { throw new Error(error) }
}

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt'] 

const update = async (cardId, updateCard) => {
    try {
        Object.keys(updateCard).forEach(fieldName => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateCard[fieldName]
            }
        })

        if(updateCard.columnId) updateCard.columnId = new ObjectId(updateCard.columnId)

        const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
            {_id: new ObjectId(cardId)},
            {$set: updateCard},
            {returnDocument: 'after'} //set false để trả về dữ liệu đã được update
        )
        return result
    } catch (error) { throw new Error(error) }
}

const deleteManyByColumnId = async (columnId) => {
    try {
        const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({columnId: new ObjectId(columnId)})
        return result
    } catch (error) { throw new Error(error)}
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findById,
  update,
  deleteManyByColumnId
}
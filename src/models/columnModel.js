import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/config.mongodb'
import { ObjectId } from 'mongodb'

// define collection Name & schema
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),

    cardOrderIds: Joi.array().items(Joi.string()).default([]),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false)
})

//validation dữ liệu trước khi insert vào model
const validateBeforeCreate = async (data) => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try { 
        const validData = await validateBeforeCreate(data)
        const newColumnToAdd = {
            ...validData,
            boardId: new ObjectId(validData.boardId)
        }
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
    } catch (error) { throw new Error(error) } //có new Error để trả về stack trace
}

const findById = async (id) => {
    try {
        return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({
            _id: new ObjectId(id) 
        })
    } catch (error) { throw new Error(error) }
}

//update giá trị cardId vào mảng cardOrderIds
const pushCardorderIds = async (card) => {
    try {
        const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(card.columnId) }, //filter
            { $push: { cardOrderIds: new ObjectId(card._id) } }, // append dữ liệu
            { returnDocument: 'after' } //set false để trả về dữ liệu đã được update
        )
        return result.value
    } catch (error) { throw new Error(error) }
}

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    createNew,
    findById,
    pushCardorderIds
}
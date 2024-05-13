import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { GET_DB } from '~/config/config.mongodb'
import ApiError from '~/utils/ApiError'
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("~/utils/validators")

const KEY_TOKEN_COLLECTION_NAME = 'keyToken'
const KEY_TOKEN_COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    publicKey: Joi.string().required(),
    privateKey: Joi.string().required(),
    refreshToken: Joi.array().items(Joi.string()).default([])
})

const validationBeforeCreate = async (data) => {
    return await KEY_TOKEN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async ({userId, publicKey, privateKey}) => {
    try {
        const newData = {
            userId, 
            publicKey,
            privateKey
        }

        const createToken = await GET_DB().collection(KEY_TOKEN_COLLECTION_NAME).insertOne(newData)

        const publicKeyString = await GET_DB().collection(KEY_TOKEN_COLLECTION_NAME).findOne({ userId: userId})
        return createToken ? publicKeyString?.publicKey : null
    } catch (error) {
        throw new Error(error)
    }
}

const findById = async (userId) => {
    try {
        return GET_DB().collection(KEY_TOKEN_COLLECTION_NAME).findOne(userId)
    } catch (error) {
        throw new Error(error)
    }
}

export const keyTokenModel = {
    createNew,
    findById
} 
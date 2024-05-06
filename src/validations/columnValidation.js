//Validation, where process validate data from request (router) to make sure that data form is true
// after success process, NEXT() to controller
import Joi, { array } from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false})
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const updateCardOrderIds = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().min(3).max(50).trim().strict(),
        cardOrderIds: Joi.array().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        )
    })

    try {
        await correctCondition.validateAsync(req.body, { 
            abortEarly: false,
            allowUnknown: true //cho phép các trường không cso trong form validation trên ví dụ columnOrderIds
        })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const columnValidation = {
    createNew,
    updateCardOrderIds
}
import { StatusCodes } from "http-status-codes"
import Joi from "joi"
import ApiError from "~/utils/ApiError"

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%\^&*)(+=._-]{3,30}$')).required(),
        username: Joi.string().alphanum().min(3).max(30).required()
    })

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const userValidation = {
    createNew
}
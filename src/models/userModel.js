import Joi from "joi"
import { GET_DB } from "~/config/config.mongodb"

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^(?!.*[0-9]-[A-Z]{3}-[0-9]{4})')).required(), //regular expression
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

    role: Joi.string().valid('admin', 'client').default('admin'),
    isActive: Joi.boolean().default(false),

    avatar: Joi.binary().encoding('base64'),

    createdAt: Joi.date().timestamp('javascript').default(Date.now), // chứa giá trị ngày giờ tạo board
    updatedAt: Joi.date().timestamp('javascript').default(null), // mặc định ban đầu là null và sẽ thay đổi khi người dùng thay đổi update trong board
    
    //user này có được xoá hay chưa 
    _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'role']

const findByEmail = async (email) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            email: email
        })
    } catch (error) {
        throw new Error(error)
    }
}

const findById = async (userId) => {
    try {
        return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
            _id: userId
        })
    } catch (error) {
        throw new Error(error)
    }
}

//validation data truoc khi create
const validateData = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
// tao newAcountr
const createNew = async (data) => {
    try {
        const validData = await validateData(data)
        return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    } catch (error) {
        throw new Error(error)
    }
}

export const userModel = {
    findByEmail,
    createNew,
    findById
}
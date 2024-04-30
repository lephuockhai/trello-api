
//trước đó đã tạo validation 1 lần ở tần cùng tên trước khi đưa vào controller nhưng vào model trước khi lưu vào hcusng ta cần phải validation 1 lần nữa để chắc chắn rằng dữ liệu đã được xử lý ok
import Joi, { date, object } from 'joi'
import { GET_DB } from '~/config/config.mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb';

// define collection Name & schema
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(), //ở slug sẽ không có max như title vì khi process ở hàm slugttify nó đã thêm - vào giữa các từ
    description: Joi.string().required().min(3).max(255).trim().strict(),

    // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
    columnOrderIds: Joi.array().items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        ).default([]), //chứa danh sách thứ tự các column bên trong 1 board mặc định là rỗng

    createdAt: Joi.date().timestamp('javascript').default(Date.now), // chứa giá trị ngày giờ tạo board
    updatedAt: Joi.date().timestamp('javascript').default(null), // mặc định ban đầu là null và sẽ thay đổi khi người dùng thay đổi update trong board

    _destroy: Joi.boolean().default(false) //board này có được xoá hay chưa 
})

//validation dữ liệu trước khi insert vào model
const validateBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try { 
        const validData = await validateBeforeCreate(data)
        return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    } catch (error) { throw new Error(error) } //có new Error để trả về stack trace
}

const findById = async (id) => {
    try {
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(id) 
        })

    } catch (error) { throw new Error(error) }
}

//query (aggregate) to take all columns & cards of board
// hôm nay sẽ giống như findbyid và sẽ update phần aggregate tiếp ở phàn tiếp
const getDetails = async (boardId) => {
    try {
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: new ObjectId(boardId) 
        })

    } catch (error) { throw new Error(error) }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findById,
    getDetails
}
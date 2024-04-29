
//trước đó đã tạo validation 1 lần ở tần cùng tên trước khi đưa vào controller nhưng vào model trước khi lưu vào hcusng ta cần phải validation 1 lần nữa để chắc chắn rằng dữ liệu đã được xử lý ok
import Joi, { date } from 'joi'
import { GET_DB } from '~/config/config.mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

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

const createNew = async (data) => {
    try { 
        return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(data)
    } catch (error) { throw new Error(error) } //có new Error để trả về stack trace
}

const findById = async (id) => {
    try {
        return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
            _id: id 
        })

    } catch (error) { throw new Error(error) }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findById
}
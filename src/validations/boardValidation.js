//Validation, where process validate data from request (router) to make sure that data form is true
// after success process, NEXT() to controller
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
    // Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho Front-end tự validate và custom message phía FE cho đep. 
    // Back-end chỉ cần validate Đảm Bảo Dữ Liệu Chuẩn Xác, và trả về message mặc định từ thư viện là được.
    // Quan trọng: Việc Validate dữ liệu BẮT BUC phải có ở phía Back-end vì đây là điểm cuối để lưu trữ dữ liệu vào Database.
    // Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả Back-end và front-end nhé.
    const correctCondition = Joi.object({
        title: Joi.string()
            .required()
            .min(3)
            .max(50)
            .trim() //xác định ở trước và sau input value có khoảng trống không.. và phải đi kèm với strict (bắt buộc)
            .strict()
            .messages({
                // custom message https://stackoverflow.com/a/68092831/23549533
                'string.base': '{{#label}} must be a string',
                'any.required': '{{#label}} is a required field',
                'string.min': '{{#label}} should have a minimum length of {{#limit}}',
                'string.max': '{{#label}} should have a maximum length of {{#limit}}',
                'string.empty': '{{#label}} cannot be an empty field',
                'string.trim': '{{#label}} must not have leading or trailing whitespace'
            }),
        description: Joi.string()
            .required()
            .min(3)
            .max(256)
            .trim()
            .strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
    })

    try {
        //abortEarly set thành false để khi trông 1 object request có nhiều lỗi validation cùng lúc nó sẽ trả về tất cả các lỗi được páht hiện
        //nếu không set giá trị cho abortEarly thì mặc định là true và nó sẽ return từng lỗi 1 mà nó phát hiện chứ không ruturn all error
        await correctCondition.validateAsync(req.body, { abortEarly: false})
        
        //khsau khi đã validate xong, có nghĩa là request hợp lệ và khi đó nó sẽ next sang tầng tiếp theo
        next()
    } catch (error) {
        //tạo mới 1 object error ApiError gồm status code và message và chuyển nó sang bước kế tiếp
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

const updateColumnIds = async (req, res, next) => {
    //khong required trong update
    const correctCondition = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .trim() //xác định ở trước và sau input value có khoảng trống không.. và phải đi kèm với strict (bắt buộc)
            .strict(),
        description: Joi.string()
            .min(3)
            .max(256)
            .trim()
            .strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
        columnOrderIds: Joi.array().items(
            Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
        )
    })

    try {
        //dùng abortearly set false để cho phép trả về tất cả lỗi trong calidation
        await correctCondition.validateAsync(req.body, { 
            abortEarly: false,
            allowUnknown: true //cho phép các trường không cso trong form validation trên ví dụ columnOrderIds
        })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
}

export const boardValidation = {
    createNew,
    updateColumnIds
}
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

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
            .strict()
    })

    try {
        // console.log('body::::',req.body)

        //abortEarly set thành false để khi trông 1 object request có nhiều lỗi validation cùng lúc nó sẽ trả về tất cả các lỗi được páht hiện
        //nếu không set giá trị cho abortEarly thì mặc định là true và nó sẽ return từng lỗi 1 mà nó phát hiện chứ không ruturn all error
        await correctCondition.validateAsync(req.body, { abortEarly: false})
        //next( )
        res.status(StatusCodes.CREATED).json({
            message: "PORT11: API create new board",
            status: StatusCodes.CREATED
        })
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message
        })
    }
}

export const boardValidation = {
    createNew
}
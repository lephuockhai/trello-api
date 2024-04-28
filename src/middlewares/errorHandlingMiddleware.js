//hàm trả về object khi có lỗi
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { env } from '~/config/environment'

export const errorHandlingMiddleware = (err, req, res, next) => {

    //mặc định giá trị status code sẽ là 500 khi mà dev không cẩn thận thiếu status code

    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    //tạo ra 1 biến responseError để kiểm soát những gì muốn response khi có lỗi
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || getReasonPhrase( StatusCodes.INTERNAL_SERVER_ERROR ), // khi không có message thì nó sẽ lấy từ thư viện http-status-codes
        stack: err.stack //path lỗi
    }

    //nếu không phải ở chế độ dev thì sẽ k cho public stack ra ngoài
    // console.log(env.BUILD_MODE)
    if (env.BUILD_MODE !== 'dev') delete responseError.stack

    res.status(responseError.statusCode).json(responseError)
}
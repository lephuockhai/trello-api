import { WHITELIST_DOMAINS } from '~/utils/constants'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// cấu hình cors option trong dự án thực tế
//CORS là một cơ chế để kiểm soát quyền truy cập của trình duyệt vào các tài nguyên ví dụ
//dùng get hoặc post đến server nếu server không phản hồi lại với các tiêu chuẩn CORS
//thì trình duyệt sẽ từ chối và báo lỗi CORS
// trong hàm dưới đây đã khai báo url http://localhost:5173 cho phép để call api nên sẽ không bị lỗi CORS

export const corsOption = {
    origin: function (origin, callback) {
        // bỏ origin (postman) nếu mô itruongf là dev thì cho qua luôn  
        if (env.BUILD_MODE === 'dev') return callback(null, true) // value1 null: no error, true: pass

        //nếu như ở môi truòng production

        //check that, domain is allow access?
        if (WHITELIST_DOMAINS.includes(origin)) return callback(null, true) // value1 null: no error, true: pass

        //domain not allowed by CORS policy
        return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`))
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    //core sẽ cho phép cookie nhận từ request, phát triển thêm đính kèm jwt access token và refresh token vào httpOnly Cookies
    credentials: true // set true to pass header, otherwide it is  omitted
}

class ApiError extends Error {
    constructor(statusCode, message) {

        //kế thừa fn cha là Error gọi đến fn Error để dùng kiến trúc this
        //vì Error đã có message rồi nên nó sẽ ghi đè message luôn cho tiện
        super(message)

        //custom error này nếu không được set thì nó sẽ lấy mặc định cảu Error
        //các dòng dưới thì không có bên trong Error nên sẽ được được nghĩa ở bên trong this.<...> nếu không có gì thì mặc định name là 'error'
        this.name = 'ApiError'
        //gán status code
        this.statusCode = statusCode

        //ghi lại stack trade để thuận tiện cho việc debug
        Error.captureStackTrace(this, this.constructor)   
    }
}

export default ApiError
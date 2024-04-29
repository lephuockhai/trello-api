//process logic after handling error on the back step
import { slugify } from '~/utils/formaters'

const createNew = async (reqBody) => {
    try {
        //xử lý logic dữ liệu tuỳ đặc thù dự án
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }

        // gọi đến tầng model để xử lý dữ liệu và lưu newboard đến database
        // xử lý các collection khác tuỳ đặc thù dự án ...
        //bắn email notification về cho admin khi có 1 cái boảd mới được tạo
        return newBoard
    } catch (error) {
        //nếu như bên service có lỗi thì nó sẽ trả lỗi về controller
        throw error
    }
}

export const boardService = {
    createNew
}
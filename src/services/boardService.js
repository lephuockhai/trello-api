//process logic after handling error on the back step
import { boardModel } from '~/models/boardModel'
import { slugify } from '~/utils/formaters'

const createNew = async (reqBody) => {
    try {
        //xử lý logic dữ liệu tuỳ đặc thù dự án
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }

        // gọi đến tầng model để xử lý dữ liệu và lưu newboard đến database
        const createdBoard = await boardModel.createNew(newBoard)
        console.log('createdBoard:::', createdBoard)

        const getNewBoard = await boardModel.findById(createdBoard.insertedId)

        console.log('getNewBoard::::', getNewBoard)

        // xử lý các collection khác tuỳ đặc thù dự án ...
        //bắn email notification về cho admin khi có 1 cái boảd mới được tạo
        return getNewBoard
    } catch (error) {
        //nếu như bên service có lỗi thì nó sẽ trả lỗi về controller
        throw error //error ở đây sẽ trả về cho controller nên không cần new
    }
}

export const boardService = {
    createNew
}
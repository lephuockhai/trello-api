//process logic after handling error on the back step
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
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

        const getNewBoard = await boardModel.findById(createdBoard.insertedId)

        // xử lý các collection khác tuỳ đặc thù dự án ...
        //bắn email notification về cho admin khi có 1 cái boảd mới được tạo
        return getNewBoard
    } catch (error) {
        //nếu như bên service có lỗi thì nó sẽ trả lỗi về controller
        throw error //error ở đây sẽ trả về cho controller nên không cần new
    }
}
const getDetails = async (boardId) => {
    try {
        const board = await boardModel.getDetails(boardId)

        if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
        return board
    } catch (error) {
        //nếu như bên service có lỗi thì nó sẽ trả lỗi về controller
        throw error //error ở đây sẽ trả về cho controller nên không cần new
    }
}

export const boardService = {
    createNew,
    getDetails
}
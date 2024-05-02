//process logic after handling error on the back step
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
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
        console.log(boardId)
        const board = await boardModel.getDetails(boardId)
        if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

        //deepclone tạo ra 1 object data mới từ board để xử lý và không làm thay đổi dữ liệu ban đầu của board
        const resBoard = cloneDeep(board)

        //đưa card vào column
        resBoard.columns.forEach(column => {
            //chuyển về dạng string để so sánh thay vì để nguyên object
            //với toString của javascript nó cần chuyển đổi về kiểu dữ liệu string để so sánh vì không so sánh được Object
            // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

            //với equal thì nó là method của mongodb hổ trợ so sánh object
            column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
        })

        //xoá card bên ngoài column vì bây giờ cards đã được thêm vào trong column
        delete resBoard.cards
        console.log(resBoard)

        return resBoard
    } catch (error) {
        //nếu như bên service có lỗi thì nó sẽ trả lỗi về controller
        throw error //error ở đây sẽ trả về cho controller nên không cần new
    }
}

export const boardService = {
    createNew,
    getDetails
}
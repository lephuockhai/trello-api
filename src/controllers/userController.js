import { StatusCodes } from "http-status-codes"
import { userService } from "~/services/userService"

const createNew = async (req, res, next) => {
    try {
        //call service
        const createAccount = await userService.createNew(req.body)

        console.log('createAccount controller:::',createAccount)

        res.status(StatusCodes.CREATED).json(createAccount)
    } catch (error) {
        next(error)
    }
}

export const userController = {
    createNew
}
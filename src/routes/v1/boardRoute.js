import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({
            message: "Note: API get list board",
            status: StatusCodes.OK
        })
    })
    //ở đây khi next từ validate được trig lên thì nó sẽ chuyển sang controller
    .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
    .get(boardController.getDetails)
    .put(boardValidation.updateColumnIds, boardController.updateColumnIds)

Router.route('/supports/moving-card')
    .put(boardValidation.updateCardToDifferenceColumn, boardController.updateCardToDifferenceColumn)
    
export const boardRoute = Router
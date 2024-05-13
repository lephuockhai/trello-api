//create fn return couple token AT vs RT
import { StatusCodes } from 'http-status-codes'
import JWT from 'jsonwebtoken'
import ApiError from '~/utils/ApiError'
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        await JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error:::', err)
            }
            else {
                console.log('decode::', decode)
            }
        })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const authUltils = {
    createTokenPair
}
import { userModel } from "~/models/userModel"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"
import { keyTokenModel } from "~/models/keyTokenModel"
import { ROLE_USER } from "~/utils/constants"
import { authUltils } from "~/auth/authUltils"
import { getInfoData } from "~/utils/getInfoData"

const createNew = async ({email, username, password}) => {
    //check email 
    const foundAcount = await userModel.findByEmail(email) //if exists then ... else null

    if (foundAcount) throw new ApiError(StatusCodes.CONFLICT, "email is already exists")
    
    //generate password to hash
    const passwordHash = await bcrypt.hash(password, 10)

    //create new account
    const createdAccount = await userModel.createNew({email, password: passwordHash, username, role: ROLE_USER.ADMIN})

    const newAccount = await userModel.findById( createdAccount.insertedId )
    console.log('🚀 ~ createNew ~ newAccount:', newAccount)

    //create Access token for login
    if (newAccount) {
        
        //create publicKey vs privateKey to generate ç
        //don gian va nhanh hon generateKeyPairSync
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 4096
        // })

        const publicKeyStore = await keyTokenModel.createNew({
            userId: newAccount.insertedId,
            publicKey,
            privateKey
        })

        if (!publicKeyStore) throw new Error("publicKeyString error")

        const tokens = await authUltils.createTokenPair({userId: newAccount.insertedId, email}, publicKey, privateKey)

        return {
            user: getInfoData({filled: ['_id', 'username', 'email'], object: newAccount}),
            tokens
        }
    }

    // return access token for login
}

export const userService = {
    createNew
}
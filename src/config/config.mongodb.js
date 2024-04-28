import { MongoClient, ServerApiVersion } from 'mongodb'
import {env} from './environment'

let trelloDatabaseInstance = null

const DB_URI = env.DATABASE_URI
const DB_NAME = env.DATABASE_NAME

const client = new MongoClient(DB_URI, {
    // chi dinh stable api https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/#std-label-nodejs-stable-api
    serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
    }
})

//connect to mongodb
export const CONNECT_DB = async () => {
    //call connect to mongodb atlas with uri decalared in mongoClientInstance
    await client.connect()

    //connect success, take data base attachment name db and assign it for trelloDatabaseInstance
    trelloDatabaseInstance = client.db(DB_NAME)
}

//close db
export const CLOSE_DB = async () => {
    await client.close()
}

export const GET_DB = () => {
    if (!trelloDatabaseInstance) throw new Error('Must connect database first!')
    return trelloDatabaseInstance 
}
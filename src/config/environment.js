import 'dotenv/config'

export const env = {
    LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT || 'localhost',
    LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST || 3052,

    DATABASE_URI: process.env.DB_URI || '',
    DATABASE_NAME: process.env.DB_NAME || 'ShopeeShopDev',

    BUILD_MODE: process.env.BUILD_MODE,

    AUTHOR: process.env.AUTHOR || 'Lephuockhai'
}
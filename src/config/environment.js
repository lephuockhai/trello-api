import 'dotenv/config'

export const env = {
    APP_PORT: process.env.APP_PORT || 'localhost',
    APP_HOST: process.env.APP_HOST || 3052,
    DATABASE_URI: process.env.DB_URI || '',
    DATABASE_NAME: process.env.DB_NAME || 'ShopeeShopDev',
    AUTHOR: process.env.AUTHOR || 'Lephuockhai'
}
import dotenv from 'dotenv'
dotenv.config()

// The port of the server, as stored in the .env file or a default value
export const port = process.env.PORT || 80
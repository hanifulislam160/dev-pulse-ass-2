import dotenv from 'dotenv'
import { env } from 'process'

dotenv.config()

const config = {
    port: env.PORT


}
export default config;
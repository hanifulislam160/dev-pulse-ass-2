import dotenv from "dotenv";
import { env } from "process";

dotenv.config({ quiet: true });

const config = {
  port: env.PORT,
  databse_url: env.DATABASE_URL,
};
export default config;

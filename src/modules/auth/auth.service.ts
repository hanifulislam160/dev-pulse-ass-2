import { pool } from "../../db";
import type { IUser } from "./auth.interface";

const signUpUserIntoDB = async (payload: IUser) => {

    const {name, email, password, role} = payload;

    const user = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, password, role]);

    return user.rows[0];

};

export const authService = { signUpUserIntoDB };
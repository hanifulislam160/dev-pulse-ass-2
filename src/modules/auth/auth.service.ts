import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";

const signUpUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (checkUser.rows.length) {
    throw new Error("User already exist with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);



  const user = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
    [name, email, hashedPassword, role],
  );

  return user.rows[0];
};

export const authService = { signUpUserIntoDB };

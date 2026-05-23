import bcrypt from "bcrypt";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
const signUpUserIntoDB = async (payload) => {
    const { name, email, password, role } = payload;
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    if (checkUser.rows.length) {
        throw new Error("User already exist with this email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at", [name, email, hashedPassword, role]);
    return user.rows[0];
};
const loginUserFromDB = async (email, password) => {
    // Find user
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    // Check user exists
    if (user.rows.length === 0) {
        throw new Error("Invalid email or password");
    }
    const existingUser = user.rows[0];
    // Compare password
    const isPasswordMatched = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }
    // Create JWT token
    const token = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    // Remove password
    const { password: _, ...userWithoutPassword } = existingUser;
    return {
        token,
        user: userWithoutPassword,
    };
};
export const authService = { signUpUserIntoDB, loginUserFromDB };
//# sourceMappingURL=auth.service.js.map
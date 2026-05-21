import { Router } from "express";
import { authController } from "./auth.controller";
// import { authController } from "./auth.controller";

const router = Router();

router.post("/auth/signup", authController.signUpUser);

export const authRoute = router;
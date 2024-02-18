import authService from "../services/authService.js";
import authAPI from "../api/auth.js";
import { Router } from "express";
import database from "../model/dbConnection.js";

const AuthService = authService(database);
const AuthApi = authAPI(AuthService);
const authRouter = Router();

authRouter.post("/signup", AuthApi.makeUser);
authRouter.get("/signup/users", AuthApi.createdUsers);
authRouter.post("/login", AuthApi.loginUsers);

export default authRouter;

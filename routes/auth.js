import authService from "../services/authService.js"
import { Router } from "express";
import database from "../model/dbConnection.js";
import bcrypt from "bcrypt";

// Instances
const AuthService = authService(database);
const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // HASH password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        // USER object
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        // CREATE new user
        await AuthService.createUser(user);

        res.status(200).json({
            status: "success"
        });

    } catch (err) {
        res.status(400).json({
            status: "error",
            error: err.stack
        })
    };
});

authRouter.post("/login", async (req, res) => {
    try {
        // USER object
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        // GET password from the database
        const password = AuthService.getPassword(user);
        const validPassword = await bcrypt.compare(user.password, password.password);
        if (!validPassword) return res.status(400).json({
            status: "error",
            error: "Invalid password."
        });

        res.status(200).json({
            status: "Logged in..."
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});


export default authRouter;
import authService from "../services/authService.js"
import { Router } from "express";
import database from "../model/dbConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validation import
import { signup, login } from "../validation.js";

// Instances
const AuthService = authService(database);
const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // Validate user req.body signup
        const { error } = signup(req.body);
        if (error) return res.json({
            error: error.details[0].message
        });

        // HASH password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        // USER object
        const user = {
            name: req.body.name.toLowerCase(),
            email: req.body.email.toLowerCase(),
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

authRouter.get("/signup/users", async (req, res) => {
    try {
        const users = await AuthService.getUsers();

        res.json({
            status: "success",
            users: users
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
        // Validate user req.body signup
        const { error } = login(req.body);
        if (error) return res.json({
            error: error.details[0].message
        });

        // USER object
        const user = {
            usernameOrEmail: req.body.usernameOrEmail.toLowerCase(),
            password: req.body.password
        };

        // Checks registered users
        const getUser = await AuthService.checkUser(user);

        if (getUser.length === 0) return res.json({
            status: "error",
            error: "User not found."
        });

        const { password, user_id, role } = getUser[0];

        const validPassword = await bcrypt.compare(user.password, password);

        if (!validPassword) return res.json({
            status: "error",
            error: "Invalid password."
        });

        const token = jwt.sign({
            id: user_id
        }, process.env.TOKEN, { expiresIn: '1h' });

        res.header("auth-token", token).status(200).json({
            status: "Logged in.",
            token: token,
            loggedUserId: user_id,
            role: role
        });

    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});


export default authRouter;

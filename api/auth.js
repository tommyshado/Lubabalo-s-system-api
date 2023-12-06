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
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        user.name.toLowerCase();
        user.email.toLowerCase();

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
            usernameOrEmail: req.body.usernameOrEmail,
            password: req.body.password
        }; 

        user.usernameOrEmail.toLowerCase()

        // Checks registered users
        const getUser = await AuthService.checkUser(user);

        if (getUser.length === 0) return res.json({
            status: "error",
            error: "Not registered in the signup page."
        })

        let password;
        let userId;
        let role;
        
        getUser.forEach(results => {
            password = results.password;
            userId = results.user_id;
            role = results.role;
        });

        const validPassword = await bcrypt.compare(user.password, password);

        if (!validPassword) return res.json({
            status: "error",
            error: "Invalid password."
        });


        const token = jwt.sign({
            id: userId
        }, process.env.TOKEN, { expiresIn: '1h' });

        res.header("auth-token", token).status(200).json({
            status: "Logged in...",
            token: token,
            loggedUserId: userId,
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

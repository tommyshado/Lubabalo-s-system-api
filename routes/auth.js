import authService from "../services/authService.js"
import { Router } from "express";
import database from "../model/dbConnection.js";
import bcrypt from "bcrypt";
import { registerValidation, loginValidation } from "../validation.js";


// Instances
const AuthService = authService(database);
const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    // Validate req.body
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({
        status: "error",
        error: error.details[0].message
    });

    // Check if email already in the database
    const email = AuthService.checkEmail(user.email);
    if (email) return res.status(400).json({
        status: "error",
        error: "Email already exists."
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

    // CREATE new user
    try {
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
        // Validate req.body
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({
            status: "error",
            error: error.details[0].message
        });
        // Check if email already in the database
        const email = AuthService.checkEmail(user.email);
        if (!email) return res.status(400).json({
            status: "error",
            error: "Invalid email."
        });

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
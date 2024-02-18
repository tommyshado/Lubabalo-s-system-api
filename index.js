import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";

// Routes imports
import cartRoutes from "./routes/cart-routes.js";
import authRoutes from "./routes/auth-routes.js";
import shoesRoutes from "./routes/shoes-routes.js";

// Instances
const app = express();

// Cors middleware
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/shoes", shoesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", authRoutes);

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "codeXer",
    resave: false,
    saveUninitialized: true
}));

// PORT variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 app started at PORT", PORT);
});

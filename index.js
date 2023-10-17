
import express from "express";
import bodyParser from "body-parser";

// Cors import
import cors from "cors";

// Routes imports
import shoesRoutes from "./api/shoesRoutes.js";
import cart from "./api/cart.js";
import authRouter from "./api/auth.js"

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/shoes", shoesRoutes);
app.use("/api/cart", cart);
app.use("/api/user", authRouter);

app.use(cors({
    origin: "*"
}));

// PORT variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 app started at PORT", PORT);
});
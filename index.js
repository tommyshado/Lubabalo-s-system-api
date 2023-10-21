
import express from "express";
import bodyParser from "body-parser";

// Cors import
import cors from "cors";

// API imports
import shoesAPI from "./api/shoes.js";
import cartAPI from "./api/cart.js";
import authAPI from "./api/auth.js";

// Instances
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/shoes", shoesAPI);
app.use("/api/cart", cartAPI);
app.use("/api/user", authAPI);

app.use(cors({
    origin: "*"
}));

// PORT variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 app started at PORT", PORT);
});
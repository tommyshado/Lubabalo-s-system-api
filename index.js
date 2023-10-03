
import express from "express";
import bodyParser from "body-parser";

// Routes imports
import shoesRoutes from "./routes/shoesRoutes.js";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Middleware
app.use("/api/shoes", shoesRoutes);

// PORT variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 app started at PORT", PORT);
});
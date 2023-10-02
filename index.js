
import express from "express";
import bodyParser from "body-parser";
import pgPromise from "pg-promise";

// Services imports
import shoesService from "./services/shoesService.js";

// Routes imports
import shoesRoutes from "./routes/shoesRoutes.js";

const app = express();
const router = express.Router();
const service = shoesService();
const route = shoesRoutes(service, router);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// PORT variable
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("app started at PORT", PORT);
});
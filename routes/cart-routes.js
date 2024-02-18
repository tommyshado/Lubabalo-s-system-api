import shoppingCart from "../services/shoppingCart.js";
import shoppingCartAPI from "../api/cart.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Import to verify users
import verifyToken from "../middlewares/verifyToken.js";

// Service instance
const ShoppingCartService = shoppingCart(database);
const ShoppingCartApi = shoppingCartAPI(ShoppingCartService);

// Router instance
const router = Router();

// Routes

router.get("/", verifyToken, ShoppingCartApi.getCart);
router.post("/shoeId/:shoeId/add", verifyToken, ShoppingCartApi.addShoeToCart);
router.post("/shoeId/:shoeId/remove", verifyToken, ShoppingCartApi.decrementShoeQty);
router.post("/shoeId/:shoeId/removeAShoe", verifyToken, ShoppingCartApi.removeShoeInCart);
router.post("/payment", verifyToken, ShoppingCartApi.makePayment);

export default router;

import shoppingCart from "../services/shoppingCart.js"
import database from "../model/dbConnection.js";
import { Router } from "express";

// Import to verify users
import verifyToken from "../middlewares/verifyToken.js";

// Service instance
const ShoppingCart = shoppingCart(database);

// Router instance
const router = Router();

// Routes

// Router for getting cart for a user
router.get("/", verifyToken, async (req, res) => {
    try {
        const data = {
            id: req.user.id
        };
        const cart = await ShoppingCart.getCart(data);
        const cartTotal = cart.reduce((total, shoeInCart) => total + Number(shoeInCart.total), 0);

        res.json({
            status: "success",
            cart: cart,
            total: cartTotal
        })

    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

// Router to add a shoe to shopping cart
router.post("/shoeId/:shoeId/add", verifyToken, async (req, res) => {
    try {
        const data = {
            shoeId: req.params.shoeId,
            id: req.user.id
        };

        // Adding to the cart
        await ShoppingCart.addToCart(data);

        res.json({
            status: "success"
        })

    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

// Router decreases the quantity of a shoe added to the shopping cart
router.post("/shoeId/:shoeId/remove", verifyToken, async (req, res) => {
    try {
        const data = {
            shoeId: req.params.shoeId,
            id: req.user.id
        };

        // Removing from the cart
        await ShoppingCart.removeFromCart(data);

        res.json({
            status: "success"
        })

    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

// Router remove a shoe from the shopping cart
router.post("/shoeId/:shoeId/removeAShoe", verifyToken, async (req, res) => {
    try {
        const data = {
            shoeId: req.params.shoeId,
            id: req.user.id
        };

        // Clear shoes in the shopping cart
        await ShoppingCart.removeShoeInCart(data);

        res.json({
            status: "success"
        })
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
})

// Router to make a payment
router.post("/payment", verifyToken, async (req, res) => {
    try {
        const payment = req.body.payment;
        const data = {
            id: req.user.id
        };
        const cart = await ShoppingCart.getCart(data);
        const cartTotal = cart.reduce((total, shoeInCart) => total + Number(shoeInCart.total), 0);

        const checkPayment = payment >= cartTotal;

        if (!checkPayment) return res.json({
            status: "error",
            error: "Insufficient payment"
        });

        // Remove all from the cart
        await ShoppingCart.removeAll(data);

        res.json({
            status: "success"
        });

    } catch (err) {
        res.json({
            status: "error",
            err: err.stack
        })
    };
});

export default router;

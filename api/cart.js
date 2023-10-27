import shoppingCart from "../services/shoppingCart.js"
import database from "../model/dbConnection.js";
import { Router } from "express";
import authService from "../services/authService.js";

// Service instance
const ShoppingCart = shoppingCart(database);
const auth = authService(database);
// Router instance
const router = Router();

// Routes

// Router for getting cart for a user
router.get("/username/:username", async (req, res) => {
    try {
        const data = {
            username: req.params.username
        };
        const checkUsername = await auth.checkUsername(data);
        if (!checkUsername) return res.json({
            status: "error",
            error: "Not registered in the registrations page"
        });
        const cart = await ShoppingCart.getCart(data);

        // Store cart total
        let totalForCart = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart) {
            // Get the shoes price and...
            // add to the total variable
            const price = cart[shoeInCart].total
            totalForCart += Number(price);
        };

        res.json({
            status: "success",
            cart: cart,
            total: totalForCart
        })

    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.post("/username/:username/shoeId/:shoeId/add", async (req, res) => {
    try {
        const data = {
            shoeId: req.params.shoeId,
            username: req.params.username
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

router.post("/username/:username/shoeId/:shoeId/remove", async (req, res) => {
    try {
        const data = {
            shoeId: req.params.shoeId,
            username: req.params.username
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

router.post("/username/:username/clear", async (req, res) => {
    try {
        const data = {
            username: req.params.username
        };

        // Clear shoes in the shopping cart
        await ShoppingCart.removeAll(data);

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

router.post("/username/:username/payment", async (req, res) => {
    try {
        const payment = req.body.payment;
        const data = {
            username: req.params.username
        };
        const cart = await ShoppingCart.getCart(data);

        // Store cart total
        let totalForCart = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart) {
            // Get the shoes price and...
            // add to the total variable
            const price = cart[shoeInCart].total
            totalForCart += Number(price);
        };
        
        const checkPayment = payment >= totalForCart;

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

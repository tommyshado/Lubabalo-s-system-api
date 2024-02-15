import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";

// Service import
import shoppingCart from "../services/shoppingCart.js";

// bcrypt import
import bcrypt from "bcrypt";

const pgp = pgPromise();
const dbURL =
    process.env.DB_CONNECTION_FOR_TESTING ||
    "postgres://oyudfdrn:YwW8bBEJVlcct8IrPjEmlXQJ_UHsTPOM@cornelius.db.elephantsql.com/oyudfdrn";
const database = pgp(dbURL);

const ShoppingCart = shoppingCart(database);

describe("shopping cart unit testing", function () {
    this.timeout(10000);

    beforeEach(async () => {
        try {
            await database.none(
                "TRUNCATE TABLE stock_inventory RESTART IDENTITY CASCADE"
            );

            await database.none(
                "TRUNCATE TABLE user_signup RESTART IDENTITY CASCADE"
            );

            await database.none(
                "TRUNCATE TABLE shopping_cart RESTART IDENTITY CASCADE"
            );

            // Inserting shoes into the stock_inventory table
            const data = [
                [
                    "adidas",
                    "samba og",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/f79-ADIDAS-Samba-OG-B75807-side-uJO.jpg",
                    7,
                    1799.0,
                    "black",
                    6,
                ],
                [
                    "adidas",
                    "samba og",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/9b2-IE7564-HOMER-SIMPSON-x-STAN-SMITH-side-3hU.jpg",
                    9,
                    2499.0,
                    "white",
                    8,
                ],
            ];
            await database.none(
                "insert into stock_inventory (shoe_name, description, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6, $7)",
                data[0]
            );
            await database.none(
                "insert into stock_inventory (shoe_name, description, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6, $7)",
                data[1]
            );

            // signing up a user
            let user = ["tommyshado", "12345", "mthunzitom.10@gmail.com"];
            // Hash password
            const salt = 10;
            const hashedPassword = await bcrypt.hash(user[1], salt);
            user[1] = hashedPassword;
            // INSERT user into the user_signup database
            await database.none(
                "insert into user_signup (username, password, email) values ($1, $2, $3)",
                user
            );

            // signing up another user
            let user__ = ["tendani", "1234", "tendani@gmail.com"];
            // Hash password
            const salt__ = 10;
            const hashedPassword__ = await bcrypt.hash(user[1], salt__);
            user__[1] = hashedPassword__;
            // INSERT user into the user_signup database
            await database.none(
                "insert into user_signup (username, password, email) values ($1, $2, $3)",
                user__
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it("should be able to get a cart", async () => {
        const data = {
            id: "1",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // GET shopping cart
        const cart = await ShoppingCart.getCart(data);

        assert.deepEqual(
            [
                {
                    description: "samba og",
                    quantity: "1",
                    shoe_id: "1",
                    shoe_price: "1799",
                    total: "1799",
                    username: "tommyshado"
                },
            ],
            cart
        );
    });

    it("should be able to decrease a shoe quantity from the cart", async () => {
        const data = {
            id: "1",
            shoeId: "2",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);

        // Remove shoe from the cart
        await ShoppingCart.removeFromCart(data);
        // GET shopping cart
        const cart = await ShoppingCart.getCart(data);

        assert.deepEqual(
            [
                {
                    description: "samba og",
                    shoe_id: 2,
                    quantity: 0,
                    shoe_price: "2499",
                    total: "0",
                    username: "tommyshado"
                },
            ],
            cart
        );
    });

    it("should be able to calculate the overall total of shoes in the cart", async () => {
        const data = {
            id: "1",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // Get cart total price
        const cart = await ShoppingCart.getCart(data);

        // Store cart total
        let total = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart) {
            total += cart[shoeInCart].total;
        }

        assert.equal(1799.0, total);
    });

    it("should be able to delete shoes in the cart when a payment is successful", async () => {
        const data = {
            id: "2",
            shoeId: "2",
        };
        const data__ = {
            id: "2",
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // Add to cart again
        await ShoppingCart.addToCart(data__);

        const cart = await ShoppingCart.getCart(data);

        // Store cart total
        let totalForCart = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart) {
            // Get the shoes price and...
            // add to the total variable
            const price = cart[shoeInCart].total;
            totalForCart += Number(price);
        }

        const cart__ = await ShoppingCart.getCart(data__);

        // Store cart total
        let totalForCart__ = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart__) {
            // Get the shoes price and...
            // add to the total variable
            const price = cart__[shoeInCart].total;
            totalForCart__ += Number(price);
        }

        // Payment from the user ---> req.body.payment
        const payment = 8596.0;
        // Check payment
        const checkPayment = payment >= totalForCart + totalForCart__;
        if (checkPayment) await ShoppingCart.removeAll(data);

        // Get cart
        // Join both arrays
        const joinCarts = (await ShoppingCart.getCart(data)).concat(
            await ShoppingCart.getCart(data__)
        );

        assert.deepEqual([], joinCarts);
    });

    it("should not be able to delete shoes in the cart when a payment is not enough", async () => {
        const data = {
            id: "1",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);

        const cart = await ShoppingCart.getCart(data);
        // Get payment from the user ---> req.body.payment
        const payment = 500.0;

        // Store cart total
        let totalForCart = 0;
        // Loop over the length of the cart then...
        for (const shoeInCart in cart) {
            // Get the shoes price and...
            // add to the total variable
            const price = cart[shoeInCart].total;
            totalForCart += Number(price);
        }

        // Check payment
        const checkPayment = payment >= totalForCart;
        if (checkPayment) await ShoppingCart.removeAll(data);

        // Get cart
        const cart__ = await ShoppingCart.getCart(data);

        assert.equal(1, cart__.length);
    });
});

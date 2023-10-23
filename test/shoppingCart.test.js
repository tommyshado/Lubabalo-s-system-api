import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";

// Service import
import shoppingCart from "../services/shoppingCart.js";

// bcrypt import
import bcrypt from "bcrypt";

const pgp = pgPromise();
const dbURL = process.env.DB_CONNECTION_FOR_TESTING;
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
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/f79-ADIDAS-Samba-OG-B75807-side-uJO.jpg",
                    7,
                    1799.0,
                    "black",
                    6,
                ],
                [
                    "adidas",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/9b2-IE7564-HOMER-SIMPSON-x-STAN-SMITH-side-3hU.jpg",
                    9,
                    2499.0,
                    "white",
                    8,
                ],
            ];
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6)",
                data[0]
            );
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6)",
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
            username: "tommyshado",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // GET shopping cart
        const cart = await ShoppingCart.getCart(data);

        assert.deepEqual([ { shoe_name: 'adidas', quantity: '1', shoe_price: '1799' } ], cart);
    });

    it("should be able to remove a shoe from the cart", async () => {
        const data = {
            username: "tendani",
            shoeId: "2",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);

        // Remove shoe from the cart
        await ShoppingCart.removeFromCart(data);
        // GET shopping cart
        const cart = await ShoppingCart.getCart(data);

        assert.deepEqual([], cart);
    });

    it("should be able to calculate the overall total of shoes in the cart", async () => {
        const data = {
            username: "tommyshado",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // Get cart total price
        const cartTotal = await ShoppingCart.getCartTotal(data);

        assert.equal(1799.00, cartTotal);
    });

    it("should be able to delete shoes in the cart when a payment is successful", async () => {
        const data = {
            username: "tendani",
            shoeId: "2",
        };
        const data__ = {
            username: "tendani",
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);
        // Add to cart again
        await ShoppingCart.addToCart(data__);

        const cartTotal = await ShoppingCart.getCartTotal(data);
        const cartTotal__ = await ShoppingCart.getCartTotal(data__);

        // Payment from the user ---> req.body.payment
        const payment = 8596.00
        // Check payment
        const checkPayment = payment >= (cartTotal + cartTotal__);
        if (checkPayment) await ShoppingCart.removeAll(data);

        // Get cart
        // Join both arrays
        const cart = (await ShoppingCart.getCart(data)).concat(await ShoppingCart.getCart(data__));

        assert.deepEqual([], cart);
    });

    it("should not be able to delete shoes in the cart when a payment is not enough", async () => {
        const data = {
            username: "tommyshado",
            // shoe_id for samba black adidas
            shoeId: "1",
        };
        // Add to cart
        await ShoppingCart.addToCart(data);

        const cartTotal = await ShoppingCart.getCartTotal(data);
        // Get payment from the user ---> req.body.payment
        const payment = 500.00;

        // Check payment
        const checkPayment = payment >= cartTotal;
        if (checkPayment) await ShoppingCart.removeAll(data);

        // Get cart
        const cart = await ShoppingCart.getCart(data);

        assert.equal(1, cart.length);
    });
});

// CREATE test cases for GETTING all the available shoes from the database

// CREATE test cases for INSERTING a new shoe in the database FRIST...
// CHECK if the shoe is not in the database THEN...
// INSERT the shoe in the database

// CREATE test cases for DELETING a shoe from the database using a shoe id FIRST...
// CHECK if the quantity is GREATER than 0 THEN...
// DELETE a shoe from the database

// CREATE test cases for a function that takes in a brand name AND...
// RETURN all the shoes for a given brand

// CREATE test cases for a function that takes in a size AND...
// RETURN all the shoes for a given size

// CREATE test cases for a function that takes in a brand and size as objects AND...
// RETURN all the shoes for a given brand and size

import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";
// Service import
import shoesService from "../services/shoesService.js";

const pgp = pgPromise();
const dbURL = process.env.DB_CONNECTION_FOR_TESTING;
const database = pgp(dbURL);

const ShoesService = shoesService(database);

describe("shoes service testing", function () {
    this.timeout(10000);

    beforeEach(async () => {
        try {
            await database.none(
                "TRUNCATE TABLE stock_inventory RESTART IDENTITY CASCADE"
            );

            // INSERTING a shoes and GETTING a shoe id
            const data = [
                "new_balance",
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/e0a-NEW-BALANCE-BBW550DY-550-WHITE-side-33p.jpg",
                1,
                2599.0,
                "white",
            ];
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color) values ($1, $2, $3, $4, $5)", data
            );
        } catch (error) {
            console.log(error);
            throw error;
        };
    });

    it("should be able to insert and get a shoes", async () => {
        try {
            // VARIABLE to store the values for the database
            const data = {
                shoeName: "adidas",
                image: "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/c83-ADIDAS-SAMBA-OG-B75806-side-vJd.jpg",
                qty: 5,
                shoePrice: 1799.0,
                shoeColor: "white",
            };
            // INSERTING values into the database
            await ShoesService.insertShoe(data);

            // GETTING the shoes
            const shoes = await ShoesService.getShoes();

            assert.equal(2, shoes.length);
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it("should be able to insert more and get more shoes", async () => {
        try {
            // VARIABLE to store the values for the database
            const data = [
                [
                    "adidas",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/c83-ADIDAS-SAMBA-OG-B75806-side-vJd.jpg",
                    5,
                    1799.0,
                    "white",
                ],
                [
                    "nike",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
                    7,
                    2199.0,
                    "white",
                ],
            ];
            // INSERTING values into the database
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color) values ($1, $2, $3, $4, $5)",
                data[0]
            );
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color) values ($1, $2, $3, $4, $5)",
                data[1]
            );

            // GETTING the shoes
            const shoes = await ShoesService.getShoes();

            assert.equal(3, shoes.length);
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it("should be able to decrease the inventory of shoes when given a shoe id", async () => {
        // takes in an id of one from the inserted shoe in the beforeEach() function
        await ShoesService.updateInventory(1);
        // GET the shoe quantity
        const qty = await database.oneOrNone(`select shoe_qty from stock_inventory where shoe_id = '1'`);
        assert.equal("0", qty.shoe_qty);
    });

    it("should be able to delete a shoe when given a shoe id and when the stock inventory is 0", async () => {
        // takes in an id of one from the inserted shoe in the beforeEach() function
        await ShoesService.updateInventory(1);
        // takes in an id of one from the inserted shoe in the beforeEach() function
        await ShoesService.deleteShoe(1);
        assert.deepEqual([], await ShoesService.getShoes());
    });
});

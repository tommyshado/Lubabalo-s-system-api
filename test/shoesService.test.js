import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";
// Service import
import shoesService from "../services/shoesService.js";

const pgp = pgPromise();
const dbURL = process.env.DB_CONNECTION_FOR_TESTING || "postgres://oyudfdrn:YwW8bBEJVlcct8IrPjEmlXQJ_UHsTPOM@cornelius.db.elephantsql.com/oyudfdrn";
const database = pgp(dbURL);

const ShoesService = shoesService(database);

describe("shoes service testing", function () {
    this.timeout(10000);

    beforeEach(async () => {
        try {
            await database.none(
                "TRUNCATE TABLE stock_inventory RESTART IDENTITY CASCADE"
            );
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it("should be able to insert and get a shoes", async () => {
        try {
            // INSERTING a shoe into the database
            const data = {
                shoeName: "new_balance",
                image:
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/e0a-NEW-BALANCE-BBW550DY-550-WHITE-side-33p.jpg",
                qty: 1,
                shoePrice: 2599.0,
                shoeColor: "white",
                shoeSize: 8,
                description: "Samba original og",
            };
            await ShoesService.insertShoe(data);

            // VARIABLE to store the values for the database
            const data__ = {
                shoeName: "adidas",
                image:
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/c83-ADIDAS-SAMBA-OG-B75806-side-vJd.jpg",
                qty: 5,
                shoePrice: 1799.0,
                shoeColor: "white",
                shoeSize: 7,
                description: "Samba original og",
            };
            // INSERTING values into the database
            await ShoesService.insertShoe(data__);

            // GETTING the shoes
            const shoes = await ShoesService.getShoes();

            assert.deepEqual([
                {
                  shoe_id: 2,
                  shoe_name: 'adidas',
                  shoe_qty: '5',
                  shoe_price: '1799',
                  shoe_color: 'white',
                  shoe_size: '7',
                  image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/c83-ADIDAS-SAMBA-OG-B75806-side-vJd.jpg',
                  description: 'Samba original og',
                  catagory: null
                },
                {
                  shoe_id: 1,
                  shoe_name: 'new_balance',
                  shoe_qty: '1',
                  shoe_price: '2599',
                  shoe_color: 'white',
                  shoe_size: '8',
                  image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/e0a-NEW-BALANCE-BBW550DY-550-WHITE-side-33p.jpg',
                  description: 'Samba original og',
                  catagory: null
                }
              ], shoes);
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
                    4,
                ],
                [
                    "nike",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
                    7,
                    2199.0,
                    "white",
                    9,
                ],
                [
                    "nike",
                    "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/ed1-NIKE-DV0991-101-WMNS-AIR-JORDAN-1-MID-WHITEBLACK-WHITE-side-SbB.jpg",
                    7,
                    2499.0,
                    "white",
                    9,
                ],
            ];
            // INSERTING values into the database
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6)",
                data[0]
            );
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6)",
                data[1]
            );
            await database.none(
                "insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6)",
                data[2]
            );

            // GETTING the shoes
            const shoes = await ShoesService.getShoes();

            assert.equal(3, shoes.length);
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    it("should be able to decrease the quantity of shoes when given a shoe id", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);
        // takes in an id from the shoeId global variable
        await ShoesService.updateInventory(1);
        // GET the shoe quantity
        const qty = await database.oneOrNone(
            `select shoe_qty from stock_inventory where shoe_id = '1'`
        );
        assert.equal("0", qty.shoe_qty);
    });

    it("should be able to increase the quantity of shoes when given a shoe id", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 2,
            shoePrice: 2099.0,
            shoeColor: "white",
            shoeSize: 9,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);
        // takes in an id from the shoeId global variable
        await ShoesService.increaseInventory(1);
        // GET the shoe quantity
        const qty = await database.oneOrNone(
            `select shoe_qty from stock_inventory where shoe_id = '1'`
        );
        assert.equal("3", qty.shoe_qty);
    });

    it("should be able to delete a shoe when given a shoe id and when the stock inventory is 0", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // takes in an id for inserted shoe
        await ShoesService.updateInventory(1);
        // delete a shoe from the inventory
        await ShoesService.deleteShoe(1);
        assert.deepEqual([], await ShoesService.getShoes());
    });

    it("should be able to filter by brand name", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "new_balance",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/0f9-NEW-BALANCE-U574KBG-U574-v2-BLACK-side-I45.jpg",
            qty: 6,
            shoePrice: 2499.0,
            shoeColor: "grey",
            shoeSize: 8,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // INSERTING another shoe
        const data__ = {
            shoeName: "nike_jordan",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/ed1-NIKE-DV0991-101-WMNS-AIR-JORDAN-1-MID-WHITEBLACK-WHITE-side-SbB.jpg",
            qty: 4,
            shoePrice: 2499.0,
            shoeColor: "black",
            shoeSize: 10,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data__);
        // takes in a param of brand name
        const filterByBrandName = await ShoesService.getShoeBrand("new_balance");

        assert.deepEqual([
            {
              shoe_id: 1,
              shoe_name: 'new_balance',
              shoe_qty: '6',
              shoe_price: '2499',
              shoe_color: 'grey',
              shoe_size: '8',
              image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/0f9-NEW-BALANCE-U574KBG-U574-v2-BLACK-side-I45.jpg',
              description: null,
              catagory: null
            }
          ], filterByBrandName);
    });

    it("should be able to filter by shoe size", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // INSERTING another shoe
        const data__ = {
            shoeName: "asics",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg",
            qty: 2,
            shoePrice: 1399.0,
            shoeColor: "purple",
            shoeSize: 3,
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data__);
        // takes in a param of brand name
        const filterByBrandName = await ShoesService.getShoeBySize(data__.shoeSize);

        assert.deepEqual([
            {
              shoe_id: 2,
              shoe_name: 'asics',
              shoe_qty: '2',
              shoe_price: '1399',
              shoe_color: 'purple',
              shoe_size: '3',
              image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg',
              description: null,
              catagory: null
            }
          ], filterByBrandName);
    });

    it("should be able to filter by brand name and size", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
            description: "air force 1",
            ageGroup: "men",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // INSERTING another shoe
        const data__ = {
            shoeName: "converse",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/pics/product/large/162053c-side_1.jpg",
            qty: 3,
            shoePrice: 1499.0,
            shoeColor: "white",
            shoeSize: 9,
            description: "all star",
            ageGroup: "women",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data__);
        // takes in a param of brand name
        const filterByBrandName = await ShoesService.getShoeBySizeAndBrand(data__);

        assert.deepEqual([
            {
              shoe_id: 2,
              shoe_name: 'converse',
              shoe_qty: '3',
              shoe_price: '1499',
              shoe_color: 'white',
              shoe_size: '9',
              image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/pics/product/large/162053c-side_1.jpg',
              description: 'all star',
              catagory: 'women'
            }
          ], filterByBrandName);
    });

    it("should be able to filter by color", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
            description: "air force 1",
            ageGroup: "men",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // INSERTING another shoe
        const data__ = {
            shoeName: "asics",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg",
            qty: 2,
            shoePrice: 1399.0,
            shoeColor: "purple",
            shoeSize: 3,
            ageGroup: "women",
            description: "ASICS Gel-Lyte III",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data__);
        const filteredByColor = await ShoesService.filterByColor("white");

        assert.equal(1, filteredByColor.length);
    });

    it("should be able to filter by color and brand name", async () => {
        // INSERTING a shoe
        const data = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            shoeSize: 9,
            ageGroup: "men",
            description: "air force 1",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data);

        // INSERTING another shoe
        const data__ = {
            shoeName: "asics",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg",
            qty: 2,
            shoePrice: 1399.0,
            shoeColor: "purple",
            shoeSize: 3,
            ageGroup: "women",
            description: "ASICS Gel-Lyte III",
        };
        await ShoesService.insertShoe(data__);

        // INSERTING a shoe
        const data___ = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            shoeColor: "white",
            ageGroup: "women",
            shoeSize: 9,
            description: "ASICS Gel-Lyte III",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data___);
        // INSERTING values into the database

        const filteredByColorAndBrand = await ShoesService.filterByColorAndBrand({
            shoeName: "asics",
            shoeColor: "purple",
        });
        assert.deepEqual({
            shoe_id: 2,
            shoe_name: 'asics',
            shoe_qty: '2',
            shoe_price: '1399',
            shoe_color: 'purple',
            shoe_size: '3',
            image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg',
            description: 'ASICS Gel-Lyte III',
            catagory: 'women'
          }, filteredByColorAndBrand);
    });

    it("should be able to filter by color, brand name and size", async () => {
        const data = {
            shoeName: "asics",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/4bc-ASICS-1201A582-700-GEL-LYTE-III-OG-BARELY-ROSE-side-b1c.jpg",
            qty: 2,
            shoePrice: 1399.0,
            shoeColor: "purple",
            ageGroup: "women",
            shoeSize: 3,
            description: "ASICS Gel-Lyte III",
        };
        await ShoesService.insertShoe(data);

        // INSERTING a shoe
        const data___ = {
            shoeName: "nike",
            image:
                "https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg",
            qty: 1,
            shoePrice: 2199.0,
            ageGroup: "men",
            shoeColor: "white",
            shoeSize: 9,
            description: "air force 1",
        };
        // INSERTING values into the database
        await ShoesService.insertShoe(data___);
        // INSERTING values into the database

        const filteredByColorBrandAndSize =
            await ShoesService.filterByColorBrandAndSize({
                shoeName: "nike",
                shoeColor: "white",
                shoeSize: "9",
            });

        assert.deepEqual({
            shoe_id: 2,
            shoe_name: 'nike',
            shoe_qty: '1',
            shoe_price: '2199',
            shoe_color: 'white',
            shoe_size: '9',
            image: 'https://res.cloudinary.com/shelflife-online/image/upload/c_fill,f_auto,q_auto:best,w_681/v1575961299/uploads/assets/3c0-Nike-Air-Force-1-Tripple-White-CW2288-111-side-f5b.jpg',
            description: 'air force 1',
            catagory: 'men'
          }, filteredByColorBrandAndSize);
    });
});

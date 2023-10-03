

const shoesService = database => {
    // CREATE a function that gets all the available shoes from the database
    const getShoes = async () => await database.manyOrNone("select * from stock_inventory");

    // CREATE a function that takes in an object of { shoeName, qty, shoePrice, shoeColor },
        // which comes from the adding of a new shoe page req.body AND...
        // INSERT the shoe object if it's not in the database

    const insertShoe = async (shoe) => {
        const data = [
            shoe.shoeName,
            shoe.image,
            shoe.qty,
            shoe.shoePrice,
            shoe.shoeColor
        ];
        await database.none("insert into stock_inventory (shoe_name, image, shoe_qty, shoe_price, shoe_color) values ($1, $2, $3, $4, $5)", data);
    };

    // CREATE a function that takes in an id as params and delete a shoe from the database using the given id FIRST...
    const updateInventory = async (shoeId) => {
        await database.none(`update stock_inventory set shoe_qty = shoe_qty - 1 where shoe_id = ${shoeId} and shoe_qty > 0`);
    };

    // CREATE a function to DELETE a shoe from the shoes database using a given shoe_id
    const deleteShoe = async (shoeId) => await database.oneOrNone(`delete from stock_inventory where shoe_id = ${shoeId} and shoe_qty = 0`);

    // CREATE a function that takes in a brand name which comes from the params AND...
    const getShoeBrand = async (brandname) => await database.manyOrNone(`select * from stock_inventory where shoe_name = '${brandname}'`);
        // RETURN all the shoes for a given brand

    // CREATE a function that takes in a size AND...
        // RETURN all the shoes for a given size

    // CREATE a function that takes in a brand and size as objects AND...
        // RETURN all the shoes for a given brand and size

    return {
        getShoes,
        insertShoe,
        updateInventory,
        deleteShoe,
        getShoeBrand
    }
};

export default shoesService;
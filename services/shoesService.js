

const shoesService = database => {
    // CREATE a function that gets all the available shoes from the database
    const getShoes = async () => await database.manyOrNone("select * from stock_inventory order by shoe_name");

    // CREATE a function that takes in an object of { shoeName, qty, shoePrice, shoeColor },
        // which comes from the adding of a new shoe page req.body AND...
        // INSERT the shoe object if it's not in the database

    const insertShoe = async (shoe) => {
        const data = [
            shoe.shoeName,
            shoe.description,
            shoe.ageGroup,
            shoe.image,
            shoe.qty,
            shoe.shoePrice,
            shoe.shoeColor,
            shoe.shoeSize
        ];
        await database.none("insert into stock_inventory (shoe_name, description, catagory, image, shoe_qty, shoe_price, shoe_color, shoe_size) values ($1, $2, $3, $4, $5, $6, $7, $8)", data);
    };

    // CREATE a function that takes in an id as params and delete a shoe from the database using the given id FIRST...
    const updateInventory = async (shoeId) => {
        await database.oneOrNone(`update stock_inventory set shoe_qty = shoe_qty - 1 where shoe_id = ${shoeId} and shoe_qty > 0 RETURNING shoe_id`);
    };

    // CREATE a function to DELETE a shoe from the shoes database using a given shoe_id
    const deleteShoe = async (shoeId) => await database.oneOrNone(`delete from stock_inventory where shoe_id = ${shoeId} and shoe_qty = 0`);

    // CREATE a function that takes in a brand name which comes from the params AND...
    const getShoeBrand = async (brandname) => await database.manyOrNone(`select * from stock_inventory where shoe_name like '%${brandname}%'`);
        // RETURN all the shoes for a given brand

    // CREATE a function that takes in a size AND...
    const getShoeBySize = async (shoeSize) => await database.manyOrNone(`select * from stock_inventory where shoe_size = '${shoeSize}'`);
        // RETURN all the shoes for a given size

    // CREATE a function that takes in a brand and size as objects AND...
    const getShoeBySizeAndBrand = async (shoe) => await database.manyOrNone(`select * from stock_inventory where shoe_size = '${shoe.shoeSize}' and shoe_name = '${shoe.shoeName}'`);
        // RETURN all the shoes for a given brand and size

    const filterByColor = async (color) => await database.manyOrNone(`select * from stock_inventory where shoe_color = '${color}'`);

    const filterByColorAndBrand = async (filtered) => {
        const data = [
            filtered.shoeName,
            filtered.shoeColor
        ]
        return await database.oneOrNone(`select * from stock_inventory where shoe_name = $1 and shoe_color = $2`, data);
    };

    const filterByColorBrandAndSize = async (filtered) => {
        const data = [
            filtered.shoeName,
            filtered.shoeColor,
            filtered.shoeSize
        ]
        return await database.oneOrNone(`select * from stock_inventory where shoe_name = $1 and shoe_color = $2 and shoe_size = $3`, data);
    };

    const getMenShoes = async (catagory) => await database.manyOrNone(`select * from stock_inventory where catagory = '${catagory.men}'`);

    const getWomenShoes = async (catagory) => await database.manyOrNone(`select * from stock_inventory where catagory = '${catagory.women}'`);

    const getKidsShoes = async (catagory) => await database.manyOrNone(`select * from stock_inventory where catagory = '${catagory.kids}'`);

    return {
        getShoes,
        insertShoe,
        updateInventory,
        deleteShoe,
        getShoeBrand,
        getShoeBySize,
        getShoeBySizeAndBrand,
        filterByColor,
        filterByColorAndBrand,
        filterByColorBrandAndSize,
        getMenShoes,
        getWomenShoes,
        getKidsShoes
    }
};

export default shoesService;
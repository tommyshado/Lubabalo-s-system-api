const shoesService = (database) => {
    const getShoes = async () =>
        await database.manyOrNone(
            "select * from stock_inventory order by shoe_name"
        );

    const insertShoe = async (shoe) => {
        const data = [
            shoe.shoeName,
            shoe.description,
            shoe.ageGroup,
            shoe.image,
            shoe.qty,
            shoe.shoePrice,
            shoe.shoeColor,
            shoe.shoeSize,
        ];
        const checkHelper = (await insertShoeHelper(shoe)).length === [].length;

        if (checkHelper) {
            await database.none(
                `insert into stock_inventory (shoe_name, description, catagory, image, shoe_qty, shoe_price, shoe_color, shoe_size) 
                 values ($1, $2, $3, $4, $5, $6, $7, $8)`,
                data
            );
        } else {
            await database.none(
                `update stock_inventory set shoe_qty = shoe_qty + $1 where shoe_name = $2`, [data[4], data[0]]
            );
        }
    };

    const insertShoeHelper = async (shoe) =>
        await database.manyOrNone(
            `select * from stock_inventory where shoe_name = $1`, shoe.shoe_name
        );

    const updateInventory = async (shoeId) => {
        await database.none(
            `update stock_inventory set shoe_qty = shoe_qty - 1 where shoe_id = $1 and shoe_qty > 0`, shoeId
        );
    };

    const increaseInventory = async (shoeId) => {
        await database.none(
            `update stock_inventory set shoe_qty = shoe_qty + 1 where shoe_id = $1`, shoeId
        );
    };

    const deleteShoe = async (shoeId) =>
        await database.oneOrNone(
            `delete from stock_inventory where shoe_id = $1`, shoeId
        );

    const getShoeBrand = async (brandname) =>
        await database.manyOrNone(
            `select * from stock_inventory where shoe_name = $1`, [brandname]
        );

    const getShoeBySize = async (shoeSize) =>
        await database.manyOrNone(
            `select * from stock_inventory where shoe_size = $1`, shoeSize
        );

    const getShoeBySizeAndBrand = async (shoe) =>
        await database.manyOrNone(
            `select * from stock_inventory where shoe_size = $1 and shoe_name = $2`, [shoe.shoeSize, shoe.shoeName]
        );

    const filterByColor = async (color) =>
        await database.manyOrNone(
            `select * from stock_inventory where shoe_color = $1`, color
        );

    const filterByColorAndBrand = async (filtered) => {
        const data = [filtered.shoeName, filtered.shoeColor];

        return await database.oneOrNone(
            `select * from stock_inventory where shoe_name = $1 and shoe_color = $2`,
            data
        );
    };

    const filterByColorBrandAndSize = async (filtered) => {
        const data = [filtered.shoeName, filtered.shoeColor, filtered.shoeSize];

        return await database.oneOrNone(
            `select * from stock_inventory where shoe_name = $1 and shoe_color = $2 and shoe_size = $3`,
            data
        );
    };

    const getMenShoes = async (catagory) =>
        await database.manyOrNone(
            `select * from stock_inventory where catagory = $1`, catagory.men
        );

    const getWomenShoes = async (catagory) =>
        await database.manyOrNone(
            `select * from stock_inventory where catagory = $1`, catagory.women
        );

    const getKidsShoes = async (catagory) =>
        await database.manyOrNone(
            `select * from stock_inventory where catagory = $1'`, catagory.kids
        );

    return {
        getShoes,
        insertShoe,
        updateInventory,
        increaseInventory,
        deleteShoe,
        getShoeBrand,
        getShoeBySize,
        getShoeBySizeAndBrand,
        filterByColor,
        filterByColorAndBrand,
        filterByColorBrandAndSize,
        getMenShoes,
        getWomenShoes,
        getKidsShoes,
    };
};

export default shoesService;

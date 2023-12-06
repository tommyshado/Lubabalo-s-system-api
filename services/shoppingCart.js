import shoesService from "./shoesService.js";

const shoppingCart = (database) => {
    // Get shoes instance
    const shoes = shoesService(database);

    const getCart = async (data) =>
        await database.manyOrNone(
            `select stock_inventory.description, shopping_cart.shoe_id, shopping_cart.quantity, stock_inventory.shoe_price,
            (shopping_cart.quantity * stock_inventory.shoe_price) AS total
            from stock_inventory inner join shopping_cart ON stock_inventory.shoe_id = shopping_cart.shoe_id
            where shopping_cart.user_id = '${data.id}'`
        );

    const addToCart = async (data) => {
        const data__ = [data.id, data.shoeId, 1];
        const checkHelper = await addToCartHelper(data);

        if (!checkHelper) {
            await database.none(
                "insert into shopping_cart (user_id, shoe_id, quantity) values ($1, $2, $3)",
                data__
            );
            // Decrement the stock qty by one
            await shoes.updateInventory(data__[1]);

        } else {
            await database.none(
                "update shopping_cart set quantity = quantity + 1 where user_id = $1 and shoe_id = $2",
                data__
            );
            // Decrement the stock qty by one
            await shoes.updateInventory(data__[1]);
        }
    };

    const addToCartHelper = async (data) =>
        await database.oneOrNone(
            `select * from shopping_cart where user_id = '${data.id}' and shoe_id = ${data.shoeId}`
        );

    const removeFromCart = async (user) => {
        const data = [user.shoeId, user.id];
        const checkHelper = await removeFromCartHelper(data);

        if (checkHelper) {
            // Increase the quantity of the stock
            await shoes.increaseInventory(data[0]);

            if (checkHelper.quantity === "0") {
                // Remove the shoe in the cart
                await database.none(
                    `delete from shopping_cart where shoe_id = ${data[0]} and user_id = '${data[1]}'`
                );
            }
        }
    };

    const removeFromCartHelper = async (data) =>
        await database.oneOrNone(
            `update shopping_cart set quantity = quantity - 1 where shoe_id = ${data[0]} and user_id = '${data[1]}' and quantity > 0 RETURNING quantity`
        );

    const removeShoeInCart = async (user) => {
        const data = [user.shoeId, user.id];
        // Update the stock inventory then...
        await removeShoeInCartHelper(data);

        // Remove the shoe in the cart
        await database.none(
            `delete from shopping_cart where shoe_id = ${data[0]} and user_id = '${data[1]}'`
        );
    };

    const removeShoeInCartHelper = async (data) => {
        await database.none(
            `update stock_inventory set shoe_qty = shoe_qty + (select quantity from shopping_cart where shoe_id = '${data[0]}' and user_id = '${data[1]}')
             where shoe_qty >= 0 and shoe_id in (select shoe_id from shopping_cart where shoe_id = '${data[0]}' and user_id = '${data[1]}')`
        );
    };

    const removeAll = async (user) => {
        await database.none(
            `delete from shopping_cart where user_id = '${user.id}'`
        );
    };

    return {
        getCart,
        addToCart,
        removeFromCart,
        removeShoeInCart,
        removeAll,
    };
};

export default shoppingCart;

import shoesService from "./shoesService.js";

const shoppingCart = (database) => {
    // Instances of the shoes service
    const shoes = shoesService(database);

    const getCart = async (data) =>
        await database.manyOrNone(
            `select stock_inventory.shoe_name, shopping_cart.shoe_id, shopping_cart.quantity, stock_inventory.shoe_price,
            (shopping_cart.quantity * stock_inventory.shoe_price) AS total
            from stock_inventory inner join shopping_cart ON stock_inventory.shoe_id = shopping_cart.shoe_id
            where shopping_cart.username = '${data.username}'`
        );

    const addToCart = async (data) => {
        const data__ = [data.username, data.shoeId, 1];
        const checkHelper = await addToCartHelper(data);

        if (!checkHelper) {
            await database.none(
                "insert into shopping_cart (username, shoe_id, quantity) values ($1, $2, $3)",
                data__
            );
            // Decrement the stock qty by one
            await shoes.updateInventory(data__[1]);

        } else {
            await database.none(
                "update shopping_cart set quantity = quantity + 1 where username = $1 and shoe_id = $2",
                data__
            );
            // Decrement the stock qty by one
            await shoes.updateInventory(data__[1]);
        };
    };

    const addToCartHelper = async (data) =>
        await database.oneOrNone(
            `select * from shopping_cart where username = '${data.username}' and shoe_id = ${data.shoeId}`
        );

    const removeFromCart = async (user) => {
        const data = [user.shoeId, user.username];
        // Delete a shoe when the qty is equal 0
        const helper = await shoes.deleteShoe(data[0]);

        if (!helper) {
            const checkShoeQty = await database.oneOrNone(
                `update shopping_cart set quantity = quantity - 1 where shoe_id = ${data[0]} and username = '${data[1]}' and quantity > 1 RETURNING shoe_id`
            );

            if (!checkShoeQty) {
                await database.none(
                    `delete from shopping_cart where shoe_id = ${data[0]} and username = '${data[1]}'`
                );

            } else {
                // Increment the qty of the shoe by one
                await shoes.increaseInventory(data[0]);
            };
        };
    };

    const removeAll = async (user) =>
        await database.none(
            `delete from shopping_cart where username = '${user.username}'`
        );

    return {
        getCart,
        addToCart,
        removeFromCart,
        removeAll,
    };
};

export default shoppingCart;

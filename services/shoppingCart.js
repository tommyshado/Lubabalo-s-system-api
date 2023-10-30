
const shoppingCart = (database) => {

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

        } else {
            await database.none(
                "update shopping_cart set quantity = quantity + 1 where username = $1 and shoe_id = $2",
                data__
            );
        };
    };

    const addToCartHelper = async (data) =>
        await database.oneOrNone(
            `select * from shopping_cart where username = '${data.username}' and shoe_id = ${data.shoeId}`
        );

    const removeFromCart = async (user) => {
        const data = [user.shoeId, user.username];

        const checkShoeQty = await database.oneOrNone(
            `update shopping_cart set quantity = quantity - 1 where shoe_id = ${data[0]} and username = '${data[1]}' and quantity > 1 RETURNING shoe_id`
        );

        if (!checkShoeQty) {
            await database.none(
                `delete from shopping_cart where shoe_id = ${data[0]} and username = '${data[1]}'`
            );
        };
    };

    const removeShoeInCart = async (user) => {
        const data = [user.shoeId, user.username];

        await database.none(
            `delete from shopping_cart where shoe_id = ${data[0]} and username = '${data[1]}'`
        );
    };

    const removeAll = async (data) => {
        // Delete shoes in the cart then...
        await database.none(
            `delete from shopping_cart where username = '${data.username}'`
        );
        // Update the stock inventory
        await removeAllHelper(data);
    };

    const removeAllHelper = async (data) => {
        await database.none(
            `update stock_inventory set shoe_qty = shoe_qty - (select quantity from shopping_cart where shoe_id = stock_inventory.shoe_id and username = '${data.username}')
             where shoe_qty > 1 and shoe_id in (select shoe_id from shopping_cart where username = '${data.username}')`
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

const shoppingCart = (database) => {
    const getCart = async (data) => 
        await database.manyOrNone(
            `select shoe_name, quantity, shoe_price from stock_inventory 
             INNER JOIN shopping_cart ON stock_inventory.shoe_id = shopping_cart.shoe_id 
             where username = '${data.username}'`
        );

    const getShoePrice = async (data) => {
        const cart = await getCart(data);
        let shoeTotal = 0;
        for (const addedToCart in cart) {
            shoeTotal = Number(cart[addedToCart].quantity) * Number(cart[addedToCart].shoe_price);
        };
        return shoeTotal;
    };

    const addToCart = async (data) => {
        const add = [data.username, data.shoeId, 1];
        const checkHelper = await addToCartHelper(data);

        if (!checkHelper) {
            await database.none(
                "insert into shopping_cart (username, shoe_id, quantity) values ($1, $2, $3)",
                add
            );
        } else {
            await database.none("update shopping_cart set quantity = quantity + 1 where username = $1 and shoe_id = $2", add);
        };
    };
    const addToCartHelper = async (data) => await database.oneOrNone(`select * from shopping_cart where username = '${data.username}' and shoe_id = ${data.shoeId}`);

    const removeFromCart = async (user) => {
        const data = [user.shoeId, user.username];
        await database.none(
            `delete from shopping_cart where shoe_id = '${data[0]}' and username = '${data[1]}'`
        );
    };

    const removeAll = async (user) => await database.none(`delete from shopping_cart where username = '${user.username}'`);

    return {
        getCart,
        getShoePrice,
        addToCart,
        removeFromCart,
        removeAll
    };
};

export default shoppingCart;

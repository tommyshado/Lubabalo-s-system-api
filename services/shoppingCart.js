const shoppingCart = (database) => {
    const getCart = async (data) => {
        return await database.manyOrNone(
            `select * from shopping_cart where username = '${data.username}'`
        );
    };

    const addToCart = async (data) => {
        const add = [data.username, data.shoeId, 1];
        await database.none(
            "insert into shopping_cart (username, shoe_id, quantity) values ($1, $2, $3)",
            add
        );
    };

    const removeFromCart = async (user) => {
        const data = [user.shoeId, user.username];
        await database.none(
            `delete from shopping_cart where shoe_id = '${data[0]}' and username = '${data[1]}'`
        );
    };

    return {
        getCart,
        addToCart,
        removeFromCart,
    };
};

export default shoppingCart;

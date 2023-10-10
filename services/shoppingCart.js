const shoppingCart = (database) => {
    const getCart = async () => {
        return await database.manyOrNone(`select * from shopping_cart`);
    };

    const addToCart = async (data) => {
        const add = [
            data.username,
            data.shoeId,
            data.qty
        ];
        await database.none(
            "insert into shopping_cart (username, shoe_id, quantity) values ($1, $2, $3)",
            add
        );
    };

    return {
        getCart,
        addToCart
    };
};

export default shoppingCart;

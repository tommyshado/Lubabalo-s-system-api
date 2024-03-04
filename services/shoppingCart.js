import shoesService from "./shoesService.js";

const shoppingCart = (database) => {
  // Get shoes instance
  const shoes = shoesService(database);

  const getCart = async ({ id }) => {
    return await database.manyOrNone(
      `SELECT user_signup.username, stock_inventory.description, shopping_cart.shoe_id, 
       shopping_cart.quantity, stock_inventory.shoe_price,
       (shopping_cart.quantity * stock_inventory.shoe_price) AS total
       FROM stock_inventory INNER JOIN shopping_cart ON stock_inventory.shoe_id = shopping_cart.shoe_id
       INNER JOIN user_signup On shopping_cart.user_id = user_signup.user_id
       WHERE shopping_cart.user_id = $1`,
      [id]
    );
  };

  const addToCart = async ({ id, shoeId }) => {
    const checkHelper = await addToCartHelper(id, shoeId);

    if (!checkHelper) {
      await database.none(
        "insert into shopping_cart (user_id, shoe_id, quantity) values ($1, $2, $3)",
        [id, shoeId, 1]
      );
      // Decrement the stock qty by one
      await shoes.updateInventory(shoeId);
    } else {
      await database.none(
        "update shopping_cart set quantity = quantity + 1 where user_id = $1 and shoe_id = $2",
        [id, shoeId]
      );
      // Decrement the stock qty by one
      await shoes.updateInventory(shoeId);
    }
  };

  const addToCartHelper = async (id, shoe_id) =>
    await database.oneOrNone(
      `select * from shopping_cart where user_id = $1 and shoe_id = $2`,
      [id, shoe_id]
    );

  const removeFromCart = async ({ shoeId, id }) => {
    const checkHelper = await removeFromCartHelper(shoeId, id);

    if (checkHelper) {
      // Increase the quantity of the stock
      await shoes.increaseInventory(shoeId);

      if (checkHelper.quantity === 0) {
        // Remove the shoe in the cart
        await database.none(
          `delete from shopping_cart where shoe_id = $1 and user_id = $2`,
          [shoeId, id]
        );
      }
    }
  };

  const removeFromCartHelper = async (shoe_id, id) =>
    await database.oneOrNone(
      `update shopping_cart set quantity = quantity - 1 where shoe_id = $1 and user_id = $2 and quantity > 0 RETURNING quantity`,
      [shoe_id, id]
    );

  const removeShoeInCart = async ({ shoeId, id }) => {
    // Update the stock inventory then...
    await removeShoeInCartHelper(shoeId, id);

    // Remove the shoe in the cart
    await database.none(
      `delete from shopping_cart where shoe_id = $1 and user_id = $2`,
      [shoeId, id]
    );
  };

  const removeShoeInCartHelper = async (shoe_id, id) => {
    await database.none(
      `update stock_inventory set shoe_qty = shoe_qty + (select quantity from shopping_cart where shoe_id = $1 and user_id = $2)
       where shoe_qty >= 0 and shoe_id in (select shoe_id from shopping_cart where shoe_id = $1 and user_id = $2)`,
      [shoe_id, id]
    );
  };

  const removeAll = async ({ id }) => {
    await database.none(`delete from shopping_cart where user_id = $1`, [id]);
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

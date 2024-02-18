import moment from "moment";
import _ from "lodash";

const shoppingCartAPI = (shoppingCartInstance) => {
  const getCart = async (req, res) => {
    try {
      const data = {
        id: req.user.id,
      };
      const cart = await shoppingCartInstance.getCart(data);
      const cartTotal = cart.reduce(
        (total, shoeInCart) => total + Number(shoeInCart.total),
        0
      );

      res.status(200).json({
        status: "success",
        cart: cart,
        total: cartTotal,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const addShoeToCart = async (req, res) => {
    try {
      const data = {
        shoeId: req.params.shoeId,
        id: req.user.id,
      };

      // Adding to the cart
      await shoppingCartInstance.addToCart(data);

      res.status(201).json({
        status: "success",
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const decrementShoeQty = async (req, res) => {
    try {
      const data = {
        shoeId: req.params.shoeId,
        id: req.user.id,
      };

      // Removing from the cart
      await shoppingCartInstance.removeFromCart(data);

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const removeShoeInCart = async (req, res) => {
    try {
      const data = {
        shoeId: req.params.shoeId,
        id: req.user.id,
      };

      // Clear shoes in the shopping cart
      await shoppingCartInstance.removeShoeInCart(data);

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const makePayment = async (req, res) => {
    try {
      const payment = req.body.payment;
      const data = {
        id: req.user.id,
      };
      let cart = await shoppingCartInstance.getCart(data);
      const cartTotal = cart.reduce(
        (total, shoeInCart) => total + Number(shoeInCart.total),
        0
      );

      if (!(payment >= cartTotal)) {
        return res.json({
          status: "error",
          error: "Insufficient payment",
        });
      }

      // Remove all from the cart
      await shoppingCartInstance.removeAll(data);

      let currentMoment = moment();

      cart = _.map(cart, (item) => ({
        ...item,
        date: currentMoment.format("YYYY-MM-DD"),
        time: currentMoment.format("HH:mm:ss"),
      }));

      res.status(200).json({
        status: "success",
        data: cart,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        err: err.stack,
      });
    }
  };

  return {
    getCart,
    addShoeToCart,
    decrementShoeQty,
    removeShoeInCart,
    makePayment,
  };
};

export default shoppingCartAPI;

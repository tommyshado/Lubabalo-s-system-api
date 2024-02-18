const shoesAPI = (shoesServiceInstance) => {
  const allShoes = async (req, res) => {
    try {
      const shoes = await shoesServiceInstance.getShoes();

      res.status(200).json({
        status: "success",
        data: shoes,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const getShoesUsingBrand = async (req, res) => {
    try {
      const { brandname } = req.params;
      const filteredByBrand = await shoesServiceInstance.getShoeBrand(brandname);

      res.status(200).json({
        status: "success",
        data: filteredByBrand,
      });
    } catch (err) {
      res.json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const getShoesUsingSize = async (req, res) => {
    try {
      const { size } = req.params;
      const filteredBySize = await shoesServiceInstance.getShoeBySize(size);

      res.status(200).json({
        status: "success",
        data: filteredBySize,
      });
    } catch (err) {
      res.json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const getShoesUsingBrandAndSize = async (req, res) => {
    try {
      const data = {
        shoeSize: req.params.size,
        shoeName: req.params.brandname,
      };
      const getFiltered = await shoesServiceInstance.getShoeBySizeAndBrand(data);

      res.status(200).json({
        status: "success",
        data: getFiltered,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const makeShoes = async (req, res) => {
    try {
      const createShoe = {
        shoeName: req.body.shoeName,
        description: req.body.description,
        ageGroup: req.body.ageGroup,
        image: req.body.image,
        qty: req.body.qty,
        shoePrice: req.body.shoePrice,
        shoeColor: req.body.shoeColor,
        shoeSize: req.body.shoeSize,
      };
      await shoesServiceInstance.insertShoe(createShoe);

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

  const incrementShoeQty = async (req, res) => {
    const { shoeId } = req.params;
    try {
      await shoesServiceInstance.increaseInventory(shoeId);

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

  const decrementShoeQty = async (req, res) => {
    const { shoeId } = req.params;
    try {
      await shoesServiceInstance.deleteShoe(shoeId);

      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const filterUsingColor = async (req, res) => {
    try {
      const { color } = req.params;
      const filtered = await shoesServiceInstance.filterByColor(color);

      res.status(200).json({
        status: "success",
        data: filtered,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const filterUsingBrandAndColor = async (req, res) => {
    try {
      const data = {
        shoeName: req.params.brandname,
        shoeColor: req.params.color,
      };
      const filtered = await shoesServiceInstance.filterByColorAndBrand(data);

      res.status(200).json({
        status: "success",
        data: filtered === null ? [] : [filtered],
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  const filterUsingBrandColorAndSize = async (req, res) => {
    try {
      const data = {
        shoeName: req.params.brandname,
        shoeColor: req.params.color,
        shoeSize: req.params.size,
      };
      const filtered = await shoesServiceInstance.filterByColorBrandAndSize(data);

      res.status(200).json({
        status: "success",
        data: filtered === null ? [] : [filtered],
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: err.stack,
      });
    }
  };

  return {
    allShoes,
    getShoesUsingBrand,
    getShoesUsingSize,
    getShoesUsingBrandAndSize,
    makeShoes,
    incrementShoeQty,
    decrementShoeQty,
    filterUsingColor,
    filterUsingBrandAndColor,
    filterUsingBrandColorAndSize,
  };
};

export default shoesAPI;

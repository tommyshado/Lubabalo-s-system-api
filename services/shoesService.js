

const shoesService = database => {
    // CREATE a function that gets all the available shoes from the database

    // CREATE a function that takes in an object of { shoeName, qty, shoePrice, shoeColor },
        // which comes from the adding of a new shoe page req.body AND...
        // INSERT the shoe object if it's not in the database


    // CREATE a function that takes in an id as params and delete a shoe from the database using the given id FIRST...
        // CHECK if the quantity is greater than 0 THEN...
        // UPDATE the shoes quantity by decreasing the quantity by one
        // OTHERWISE, USE the helper function to DELETE a shoe from the shoes database
    // CREATE a helper function to DELETE a shoe from the shoes database using a given shoe_id


    // CREATE a function that takes in a brand name AND...
        // RETURN all the shoes for a given brand

    // CREATE a function that takes in a size AND...
        // RETURN all the shoes for a given size

    // CREATE a function that takes in a brand and size as objects AND...
        // RETURN all the shoes for a given brand and size


};

export default shoesService;
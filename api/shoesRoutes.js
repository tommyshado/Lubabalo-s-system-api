import shoesService from "../services/shoesService.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Service instance
const ShoesService = shoesService(database);
// Router instance
const router = Router();


// Filtering using brand name and sizes
router.get("/", async (req, res) => {
    try {
        // GET all the available shoes
        const shoes = await ShoesService.getShoes();
        res.status(200).json({
            status: "success",
            data: shoes
        });
        
    } catch (err) {
        res.status(500).json({ 
            status: "error",
            error: err.stack
        });
    };
});

router.post("/brand/:brandname", async (req, res) => {
    try {
        const nameOfBrand = req.body.brandname;
        const filteredByBrand = await ShoesService.getShoeBrand(nameOfBrand);

        res.status(200).json({
            status: "success",
            data: filteredByBrand
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
        
    };
});

router.get("/brand/size/:size", async (req, res) => {
    try {
        const shoeSize = req.params.size;
        const filteredBySize = await ShoesService.getShoeBySize(shoeSize);
        res.status(200).json({
            status: "success",
            data: filteredBySize
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
        
    };
});

router.get("/brand/:brandname/size/:size", async (req, res) => {
    try {
        const data = {
            shoeSize: req.params.size,
            shoeName: req.params.brandname
        };
        const getFiltered = await ShoesService.getShoeBySizeAndBrand(data);
        res.status(200).json({
            status: "success",
            data: getFiltered
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
        
    };
});

router.post("/brand/shoes/sold/updateInventory/:id", async (req, res) => {
    try {
        // DECREASE the stock levels by one
        await ShoesService.updateInventory(req.params.id);

        res.status(200).json({
            status: "success"
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        });
    };
});

router.post("/brand/shoes/sold/:id", async (req, res) => {
    try {
        // DELETE a shoe
        await ShoesService.deleteShoe(req.params.id);

        res.status(200).json({
            status: "success"
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        });
    };
});

router.post("/", async (req, res) => {
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
        await ShoesService.insertShoe(createShoe);

        res.status(200).json({
            status: "success"
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        });
    };
});

// Filtering with colors, brand names and sizes
router.get("/brand/color/:color", async (req, res) => {
    try {
        const shoeColor = req.params.color;
        const filtered = await ShoesService.filterByColor(shoeColor);

        res.json({
            status: "success",
            data: filtered
        })
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.get("/brand/:brandname/color/:color", async (req, res) => {
    try {
        const data = {
            shoeName: req.params.brandname,
            shoeColor: req.params.color,
        }
        const filtered = await ShoesService.filterByColorAndBrand(data);

        res.json({
            status: "success",
            data: filtered
        })
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.get("/brand/:brandname/color/:color/size/:size", async (req, res) => {
    try {
        const data = {
            shoeName: req.params.brandname,
            shoeColor: req.params.color,
            shoeSize: req.params.size
        }
        const filtered = await ShoesService.filterByColorBrandAndSize(data);

        res.json({
            status: "success",
            data: filtered
        })
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.get("/brand/catagory/:men", async (req, res) => {
    try {
        const catagory = {
            men: req.params.men
        };
        const filtered = await ShoesService.getMenShoes(catagory);

        res.json({
            status: "success",
            data: filtered
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.get("/brand/catagory/:women", async (req, res) => {
    try {
        const catagory = {
            women: req.params.women
        };
        const filtered = await ShoesService.getWomenShoes(catagory);

        res.json({
            status: "success",
            data: filtered
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

router.get("/brand/catagory/:kids", async (req, res) => {
    try {
        const catagory = {
            kids: req.params.kids
        };
        const filtered = await ShoesService.getKidsShoes(catagory);

        res.json({
            status: "success",
            data: filtered
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

export default router;
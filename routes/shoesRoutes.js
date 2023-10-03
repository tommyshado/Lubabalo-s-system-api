import shoesService from "../services/shoesService.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Service instance
const ShoesService = shoesService(database);
// Router instance
const router = Router();

router.get("/", async (req, res) => {
    try {
        // GET all the available shoes
        const shoes = await ShoesService.getShoes();
        res.status(200).json(shoes);
        
    } catch (error) {
        res.status(500).json({ status: "error" });
    };
});

router.get("/brand/:brandname", async (req, res) => {
    try {
        const nameOfBrand = req.params.brandname;
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

router.get("/brand/brand/:brandname/size/:size", async (req, res) => {
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
        const updatedQty = await ShoesService.updateInventory(req.params.id);

        res.status(200).json({
            status: "success",
            data: updatedQty
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
        // DECREASE the stock levels by one
        const updatedQty = await ShoesService.deleteShoe(req.params.id);

        res.status(200).json({
            status: "success",
            data: updatedQty
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
            image: req.body.image,
            qty: req.body.qty,
            shoePrice: req.body.shoePrice,
            shoeColor: req.body.shoeColor,
            shoeSize: req.body.ShoeSize
        };
        const insertedShoe = await ShoesService.insertShoe(createShoe);

        res.status(200).json({
            status: "success",
            data: insertedShoe
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        });
    };
});

export default router;
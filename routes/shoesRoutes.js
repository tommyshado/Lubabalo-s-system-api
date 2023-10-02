import shoesService from "../services/shoesService.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Service instance
const ShoesService = shoesService(database);
// Router instance
const router = Router();

router.get("/", async (req, res) => {
    try {
        const shoes = await ShoesService.getShoes();
        res.status(200).json(shoes);
        
    } catch (error) {
        res.status(500).json({ status: "error" });
    };
});

router.get("/brand/:brandname", (req, res) => {
    res.send("shoes brand...");
});

router.get("/brand/size/:size", (req, res) => {
    res.send("shoes size...");
});

router.get("/brand/brand/:brandname/size/:size", (req, res) => {
    res.send("shoes brand and size...");
});

router.post("/brand/shoes/sold/updateInventory/:id", async (req, res) => {
    try {
        const shoeUpdate = await ShoesService.updateInventory(req.params.id);

        res.send(shoeUpdate);

        res.json({
            status: "success"
        });
        
    } catch (error) {
        res.json({
            status: "error"
        });
    };
});

router.post("/brand/shoes/sold/:id", (req, res) => {
    console.log("sold shoes...");
});

router.post("/", async (req, res) => {
    try {
        const shoe = {
            shoeName: req.body.shoeName,
            image: req.body.image,
            qty: req.body.qty,
            shoePrice: req.body.shoePrice,
            shoeColor: req.body.shoeColor,
        };
        const insertedShoe = await ShoesService.insertShoe(shoe);

        res.send(insertedShoe);

        res.json({
            status: "success",
        });
        
    } catch (error) {
        res.json({
            status: "error"
        });
    };
});

export default router;
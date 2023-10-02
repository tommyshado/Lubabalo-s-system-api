import shoesService from "../services/shoesService.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Service instance
const ShoesService = shoesService(database);
// Router instance
const router = Router();

router.get("/", (req, res) => {
    res.send("shoes route...");
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

router.post("/brand/shoes/sold/:id", (req, res) => {
    console.log("sold shoes...");
});

router.post("/", (req, res) => {
    console.log("added a new shoe...");
});

export default router;
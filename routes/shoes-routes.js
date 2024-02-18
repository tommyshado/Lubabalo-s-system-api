import shoesService from "../services/shoesService.js";
import shoesAPI from "../api/shoes.js";
import database from "../model/dbConnection.js";
import { Router } from "express";

// Service instance
const ShoesService = shoesService(database);
const ShoesApi = shoesAPI(ShoesService);

const router = Router();

router.get("/", ShoesApi.allShoes);
router.post("/", ShoesApi.makeShoes);
router.get("/brand/:brandname", ShoesApi.getShoesUsingBrand);
router.get("/brand/size/:size", ShoesApi.getShoesUsingSize);
router.get("/brand/:brandname/size/:size", ShoesApi.getShoesUsingBrandAndSize);
router.post("/shoeId/:shoeId/add", ShoesApi.incrementShoeQty);
router.post("/shoeId/:shoeId/remove", ShoesApi.decrementShoeQty);
router.get("/brand/color/:color", ShoesApi.filterUsingColor);
router.get("/brand/:brandname/color/:color", ShoesApi.filterUsingBrandColorAndSize);
router.get("/brand/:brandname/color/:color/size/:size", ShoesApi.filterUsingBrandColorAndSize);

export default router;

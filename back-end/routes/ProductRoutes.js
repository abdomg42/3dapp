import express, { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts} from "../controllers/ProductControllers.js"
import { uploadProduct } from "../middleware/upload.js";

const routerProduct = express.Router(); 

routerProduct.get("/getProducts",getAllProducts);
routerProduct.get("/getProduct/:id",getProduct);
routerProduct.get("/search", searchProducts);

routerProduct.post("/createProduct", uploadProduct.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), createProduct);

routerProduct.put("/updateProduct/:id",updateProduct);
routerProduct.delete("/deleteProduct/:id",deleteProduct);

export default routerProduct;
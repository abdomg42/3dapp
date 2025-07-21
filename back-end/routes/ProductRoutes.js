import express, { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct,deleteProduct} from "../controllers/ProductControllers.js"
const routerProduct = express.Router(); 

routerProduct.get("/getProducts",getAllProducts);
routerProduct.get("/getProduct/:id",getProduct);

routerProduct.post("/createProduct", createProduct);

routerProduct.put("/updateProduct/:id",updateProduct);
routerProduct.delete("/deleteProduct/:id",deleteProduct);

export default routerProduct ;
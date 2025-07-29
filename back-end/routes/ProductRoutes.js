import express, { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts} from "../controllers/ProductControllers.js"
import {getProductsByCategory, getProductsByFormat, getProductsByLogiciel, getProductsWithSort} from "../controllers/ProductFilterControllers.js"
import { uploadProduct } from "../middleware/upload.js";

const routerProduct = express.Router(); 

routerProduct.get("/getProducts",getAllProducts);
routerProduct.get("/getProductsWithSort", getProductsWithSort);
routerProduct.get("/getProduct/:id",getProduct);
routerProduct.get("/search", searchProducts);
routerProduct.get("/category/:categoryName", getProductsByCategory);
routerProduct.get("/format/:formatName", getProductsByFormat);
routerProduct.get("/logiciel/:logicielName", getProductsByLogiciel);

routerProduct.post("/createProduct", uploadProduct.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), createProduct);

routerProduct.put("/updateProduct/:id",updateProduct);
routerProduct.delete("/deleteProduct/:id",deleteProduct);

export default routerProduct;
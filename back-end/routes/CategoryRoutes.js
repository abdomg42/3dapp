import express, { Router } from "express";
import {getAllCategories, getCategory, createCategory, updateCategory,deleteCategory} from "../controllers/CategoryControllers.js"
const CategoryRouter = express.Router(); 

CategoryRouter.get("/getCategories",getAllCategories);
CategoryRouter.get("/getCategory/:id",getCategory);

CategoryRouter.post("/createCategory", createCategory);

CategoryRouter.put("/updateCategory/:id",updateCategory);
CategoryRouter.delete("/deleteCategory/:id",deleteCategory);

export default CategoryRouter ;
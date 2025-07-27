import express, { Router } from "express";
import {getAllFormats, getFormat, createFormat, updateFormat,deleteFormat} from "../controllers/FormatControllers.js"
const FormatRouter = express.Router(); 

FormatRouter.get("/getFormats",getAllFormats);
FormatRouter.get("/getFormat/:id",getFormat);

FormatRouter.post("/createFormat", createFormat);

FormatRouter.put("/updateFormat/:id",updateFormat);
FormatRouter.delete("/deleteFormat/:id",deleteFormat);

export default FormatRouter ;
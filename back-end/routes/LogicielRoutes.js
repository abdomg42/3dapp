import express, { Router } from "express";
import {getAllLogiciels, getLogiciel, createLogiciel, updateLogiciel,deleteLogiciel} from "../controllers/LogicielControllers.js"
const LogicielRouter = express.Router(); 

LogicielRouter.get("/getLogiciels",getAllLogiciels);
LogicielRouter.get("/getLogiciel/:id",getLogiciel);

LogicielRouter.post("/createLogiciel", createLogiciel);

LogicielRouter.put("/updateLogiciel/:id",updateLogiciel);
LogicielRouter.delete("/deleteLogiciel/:id",deleteLogiciel);

export default LogicielRouter ;
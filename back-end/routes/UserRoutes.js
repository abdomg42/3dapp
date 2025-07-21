import express, { Router } from "express";
import {getAllUsers, getUser, createUser, updateUser,deleteUser} from "../controllers/UserControllers.js"
const UserRouter = express.Router(); 

UserRouter.get("/getUsers",getAllUsers);
UserRouter.get("/getUser/:id",getUser);

UserRouter.post("/createUser", createUser);

UserRouter.put("/updateUser/:id",updateUser);
UserRouter.delete("/deleteUser/:id",deleteUser);

export default UserRouter;
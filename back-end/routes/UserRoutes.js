import express, { Router } from "express";
import {getAllUsers, getUser, createUser, updateUser,deleteUser, loginUser, logoutUser, RefreshToken, getProfile} from "../controllers/UserControllers.js"
import {protectRoute , adminRoute} from "../middleware/auth.js";
const UserRouter = express.Router(); 

UserRouter.get("/getUsers", protectRoute,adminRoute,getAllUsers);
UserRouter.get("/getUser/:id", protectRoute,adminRoute, getUser);

UserRouter.post("/createUser",createUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/logout", logoutUser);
UserRouter.post("/RefreshToken", RefreshToken);
UserRouter.get("/profile",protectRoute, getProfile);


UserRouter.put("/updateUser/:id", protectRoute, adminRoute, updateUser);
UserRouter.delete("/deleteUser/:id", protectRoute, adminRoute, deleteUser);

export default UserRouter;

import express from "express";
import { addToFavorites, removeFromFavorites, getUserFavorites, checkFavorite } from "../controllers/FavoritesControllers.js";
import { protectRoute } from "../middleware/auth.js";

const FavoritesRouter = express.Router();

// All routes require authentication
FavoritesRouter.use(protectRoute);

// Add product to favorites
FavoritesRouter.post("/add", addToFavorites);

// Remove product from favorites
FavoritesRouter.delete("/remove", removeFromFavorites);

// Get user's favorite products
FavoritesRouter.get("/user", getUserFavorites);

// Check if product is in favorites
FavoritesRouter.get("/check/:productId", checkFavorite);

export default FavoritesRouter; 
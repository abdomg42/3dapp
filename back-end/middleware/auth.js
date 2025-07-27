import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const { JWT_SECRET } = process.env; 

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			const decoded = jwt.verify(accessToken, `${JWT_SECRET}`);
			const user = await db.oneOrNone('SELECT id, name, email, role  FROM users WHERE id = $1', [decoded.userId]);

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			req.user = user;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

export const adminRoute = (req, res, next) => {

	if (req.user && req.user.role === 'admin') {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};

import db from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const {JWT_SECRET, NODE_ENV} = process.env;

export const getAllUsers = async (req, res) =>{
    try {
    const users = await db.any(`
      SELECT * 
      FROM users 
    `);
    res.json(users);

  } catch (err) {
    res.status(500).json({error :'Error fetching users ' });
    console.log(err);
  }
};

export const getUser = async (req, res) =>{
    const { id } = req.params;
    try {
        const user = await db.oneOrNone(`  
         SELECT * 
        FROM users 
        WHERE id = $1
            `, [id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({error :'Error fetching user ' });
        console.log(err);
    }
};  



export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password,role } = req.body;
  try {
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await db.oneOrNone(
      `UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *`,
      [name ?? existingUser.name, email ?? existingUser.email, hashedPassword, role?? existingUser.role, id]
    );
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error updating user' });
  }
};


const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7); // 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure:`${NODE_ENV}`=== 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: `${NODE_ENV}` === 'production',
        sameSite: 'strict', // prevent cross-site scripting attacks CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const createUser = async (req, res) => {
  const { name, email, password , role} = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check for duplicate email
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const inserted = await db.oneOrNone(
      `INSERT INTO users(name, email, password,role) VALUES ($1, $2, $3,$4) RETURNING *`,
      [name, email, hashedPassword,role]
    );
    //authenticate 
    const {accessToken, refreshToken} = await generateTokens(inserted.id);  
    await storeRefreshToken(inserted.id, refreshToken); 
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      id: inserted.id,
      name : inserted.name,
      email: inserted.email,
      role: inserted.role,
    });
  } catch (error) {
    console.log('ERROR:', error);
    res.status(500).json({ error: 'Error creating User' });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const {accessToken, refreshToken} = await generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken); 
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
      id: user.id,
      name : user.name,
      email: user.email,
      role : user.role,
        });
   
  } catch (err) {
    console.log('error in log in controller' , err.message)
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const logoutUser =  async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken,`${JWT_SECRET}`);
        await redis.del(`refresh_token:${decoded.userId}`);
      }
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) =>{
    const { id } = req.params;
    try {
        const result = await db.result(`
            DELETE 
            FROM users 
            WHERE id = $1`, [id]);        
        if (result.rowCount === 0) return res.status(404).json({ error: 'user not found' });
        res.json({ message: 'user deleted' });
    } catch(error){
        console.log(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
}  

export const RefreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken,`${JWT_SECRET}`);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		// Get user data
		const user = await db.oneOrNone('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.userId]);
		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, `${JWT_SECRET}` , { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: `${NODE_ENV}` === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ 
			message: "Token refreshed successfully",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
    console.log(error)
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const getProfile = async (req, res) => {
	try {
    
		res.status(200).json(req.user);
	} catch (error) {
    console.log(error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
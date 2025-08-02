import express from "express";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import router from "./routes/ProductRoutes.js";
import db from "./config/db.js";
import routerProduct from "./routes/ProductRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";
import FormatRouter from "./routes/FormatRoutes.js";
import LogicielRouter from "./routes/LogicielRoutes.js";
import FavoritesRouter from "./routes/FavoritesRoutes.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from upload directory
app.use('/upload', express.static(path.join(process.cwd(), 'upload/files')));

app.get('/db-test', async (req, res) => {
  try {
    const result = await db.one('SELECT NOW() as time');
    res.send(`Database connected! Server time: ${result.time}`);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});
// Serve images directory
app.use('/images', express.static(path.join(process.cwd(), 'upload/images')));

app.use("/Product",routerProduct);
app.use("/user",UserRouter);
app.use("/Category",CategoryRouter);
app.use("/Format",FormatRouter);
app.use("/Logiciel",LogicielRouter);
app.use("/favorite", FavoritesRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

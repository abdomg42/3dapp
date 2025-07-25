import express from "express";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import router from "./routes/ProductRoutes.js";
import db from "./config/db.js";
import routerProduct from "./routes/ProductRoutes.js";
import UserRouter from "./routes/UserRoutes.js";
import CategoryRouter from "./routes/CategoryRoutes.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const localPath = path.join('C:/Users/USER/Downloads/chair');
app.use('/images', express.static(localPath));


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/db-test', async (req, res) => {
  try {
    const result = await db.one('SELECT NOW() as time');
    res.send(`Database connected! Server time: ${result.time}`);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection failed');
  }
});
app.use(express.json());
app.use("/Product",routerProduct);
app.use("/user",UserRouter);
app.use("/Category",CategoryRouter);

app.listen(port, () => {
  console.log(` app is listening on port ${port}`)
})

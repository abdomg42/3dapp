import pgPromise from 'pg-promise'
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pgp = pgPromise()
const connection = {
  host: `${PGHOST}`,
  port: 5432,
  database: `${PGDATABASE}`,
  user: `${PGUSER}`,
  password: `${PGPASSWORD}`,
};
const db = pgp(connection);

export default db ;
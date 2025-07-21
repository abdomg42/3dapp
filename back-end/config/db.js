import pgPromise from 'pg-promise'

const pgp = pgPromise()
const connection = {
  host: 'localhost',
  port: 5432,
  database: 'mkstudio',
  user: 'admin',
  password: 'admin',
};
const db = pgp(connection);

export default db ;
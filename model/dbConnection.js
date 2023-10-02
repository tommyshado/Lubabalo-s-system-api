import pgPromise from "pg-promise";
import 'dotenv/config';
const connection = process.env.DB_CONNECTION_FOR_LOGIC;

const database = pgPromise()(connection);
database.connect();

export default database;
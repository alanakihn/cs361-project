import express, { Express, Request, Response } from "express";
import { Client } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5433'),
};

const app: Express = express();
const client = new Client(config);

client.connect().then(() => {
  console.log(`Connected to auth postgres database at ${config.host}:${config.port}`);
});
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  return res.json({msg: "Express and TypeScript Server"});
});

app.post("/signup", (req: Request, res: Response) => {

});

app.post("/login", (req: Request, res: Response) => {

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

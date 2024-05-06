import express, { Express, NextFunction, Request, Response } from "express";
import { Client } from 'pg';
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Joi, { ObjectSchema } from "joi";
import jwt from "jsonwebtoken";
import cors from 'cors';

dotenv.config();

const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (!error) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i: Joi.ValidationErrorItem) => i.message).join(",");
      res.status(400).json({ error: message });
    }
  };
};

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5433'),
};

const app: Express = express();
app.use(express.json());
app.use(cors());
const client = new Client(config);

interface User {
  uid: string,
  username: string,
  password: string,
  created_at: string,
}

interface ParsedJWT {
  uid: string,
  iat: number,
  exp: number,
}

client.connect().then(() => {
  console.log(`Connected to auth postgres database at ${config.host}:${config.port}`);
});
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET!!;

const createNewUser = async (username: string, password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const uid = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING uid', [username, hashedPassword]);

  return uid.rows[0].uid;
};

app.get("/", (req: Request, res: Response) => {
  return res.json({msg: "Express and TypeScript Server"});
});

const SignupSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
app.post("/signup", validate(SignupSchema), async (req: Request, res: Response) => {
  const uid = await createNewUser(req.body.username, req.body.password);

  return res.status(201).json({
    uid,
  });
});

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
app.post("/login", validate(LoginSchema), async (req: Request, res: Response) => {
  const result = await client.query('SELECT * FROM users WHERE username=$1', [req.body.username]);

  const user: User = result.rows[0];

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  
  if (await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ uid: user.uid }, jwtSecret, {
      expiresIn: '1d',
    });
    return res.status(200).json({ uid: user.uid, token });
  }

  return res.status(403).json({
    error: 'Invalid password',
  });
});

const VerifyTokenSchema = Joi.object({
  uid: Joi.string(),
  token: Joi.string().required(),
});
app.post("/verify", validate(VerifyTokenSchema), async (req: Request, res: Response) => {
  try {
    const user = jwt.verify(req.body.token, jwtSecret) as ParsedJWT;

    if (req.body.uid) {
      if (user.uid !== req.body.uid) {
        return res.status(400).json({ error: "Invalid or outdated bearer token" });
      }
    }

    const result = await client.query('SELECT * FROM users WHERE uid=$1', [user.uid]);
    const dbUser: User = result.rows[0];

    return res.status(200).send({ uid: user.uid, username: dbUser.username, createdAt: dbUser.created_at });
  } catch (err) {
    return res.status(400).json({ error: "Invalid or outdated bearer token" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import express, { Express, NextFunction, Request, Response } from "express";
import { Client } from 'pg';
import dotenv from "dotenv";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import Joi, { ObjectSchema } from 'joi';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'storage/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname)) // Appends extension
  }
});

const upload = multer({ storage: storage });

interface AuthVerify {
  uid: string,
}

const getUidFromToken = async (token: string) => {
  try {
    const result = await axios.post(process.env.AUTH_HOST + '/verify', {
      token,
    });

    const data: AuthVerify = result.data;

    console.log(data);

    return data.uid;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const parseToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.token) {
    return res.status(400).json({
      error: "Invalid token."
    });
  }

  const uid = await getUidFromToken(req.query.token as string);
  if (!uid) {
    return res.status(400).json({
      error: "Invalid token."
    });
  }
  req.uid = uid;
  console.log(req.uid);
  next();
};

const config = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5434'),
};

const app: Express = express();
app.use(express.json());
app.use(cors());
const client = new Client(config);

client.connect().then(() => {
  console.log(`Connected to images postgres database at ${config.host}:${config.port}`);
});

const port = process.env.PORT || 3002;

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Express and TypeScript Server" });
});

app.post("/image", parseToken, upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const imagePath = req.file.path;
  console.log(req.body.uid);
  try {
    await client.query('INSERT INTO images (path, uid) VALUES ($1, $2)', [imagePath, req.uid]);
    const imageId = await client.query('SELECT * FROM images WHERE path=$1', [imagePath]);

    res.status(201).send({ message: 'Image uploaded successfully', id: imageId.rows[0].id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database operation failed." });
  }
});

app.get("/image", async (req: Request, res: Response) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: "Missing image ID." });
  }
  try {
    const result = await client.query('SELECT path FROM images WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      const filePath = result.rows[0].path;
      res.sendFile(filePath, { root: '.' });
    } else {
      res.status(404).json({ error: "Image not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Database operation failed." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


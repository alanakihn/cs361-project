import express, { Express, NextFunction, Request, Response } from "express";
import { Client } from 'pg';
import dotenv from "dotenv";
import Joi, { ObjectSchema } from "joi";
import cors from 'cors';
import axios from 'axios';

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
  port: parseInt(process.env.PGPORT || '5435'),
};

const app: Express = express();
app.use(express.json());
app.use(cors());
const client = new Client(config);

client.connect().then(() => {
  console.log(`Connected to auth postgres database at ${config.host}:${config.port}`);
});
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  return res.json({msg: "Express and TypeScript Server"});
});

const recipeSchema = Joi.object({
  title: Joi.string().required(),
  image_links: Joi.array().items(Joi.string().uri()),
  description: Joi.string().required(),
  author_uid: Joi.string().guid({ version: 'uuidv4' }).required(),
});

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  const author_uid = req.body.author_uid || req.params.author_uid;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const response = await axios.post("http://localhost:4000/verify", { uid: author_uid, token });
    if (response.status === 200) {
      next();
    } else {
      res.status(401).json({ error: "Invalid or outdated bearer token" });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid or outdated bearer token" });
  }
};

// Create a new recipe
app.post("/recipes", validate(recipeSchema), verifyToken, async (req: Request, res: Response) => {
  const { title, image_links, description, author_uid } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO recipes (title, image_links, description, author_uid, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [title, image_links, description, author_uid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read all recipes
app.get("/recipes", async (req: Request, res: Response) => {
  try {
    const result = await client.query('SELECT * FROM recipes');
    res.status(200).json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Read a single recipe by ID
app.get("/recipes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a recipe by ID
app.put("/recipes/:id", validate(recipeSchema), verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, image_links, description, author_uid } = req.body;
  try {
    const result = await client.query(
      'UPDATE recipes SET title = $1, image_links = $2, description = $3, author_uid = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [title, image_links, description, author_uid, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a recipe by ID
app.delete("/recipes/:id", verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM recipes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ msg: "Recipe deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

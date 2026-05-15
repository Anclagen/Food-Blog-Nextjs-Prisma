import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models"; // register associations
import sequelize from "./config/database";
import productsRouter from "./routes/products";
import listsRouter from "./routes/lists";
import authRouter from "./routes/auth";
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/products", requireAuth, productsRouter);
app.use("/api/lists", requireAuth, listsRouter);

async function start() {
  await sequelize.authenticate();
  console.log("Database connected");
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { designsRouter } from "./routes/designs.routes.js";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

// app.use("/designs", designsRouter);

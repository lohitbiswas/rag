import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import pineconeRoutes from "./route/pinecone.route";
const app = express();

app.use(bodyParser.json());

// Example health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/pinecone", pineconeRoutes);

export default app;

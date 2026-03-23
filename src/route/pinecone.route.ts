import { Router } from "express";
import {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecord,
  getAllRecords,
  searchRecordsByText,
  testLLMController,
  listSupportedModelsController,
  listEmbeddingModelsController,
} from "../controller/pinecone.controller";

const router = Router();

router.post("/records", createRecord);
router.put("/records/:id", updateRecord);
router.delete("/records/:id", deleteRecord);
router.get("/records/:id", getRecord);
router.get("/records", getAllRecords);
router.get("/search", searchRecordsByText);
router.get("/llm-test", testLLMController);

// List all active embedding models
router.get("/embedding-models", listEmbeddingModelsController);

export default router;

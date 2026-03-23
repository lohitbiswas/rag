export async function listEmbeddingModelsController(
  req: Request,
  res: Response,
) {
  try {
    const models = await PineconeService.listEmbeddingModels();
    res.status(200).json(models);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch embedding models", details: error });
  }
}

type SearchHit = {
  id: string;
  score: number;
  fields?: {
    chunk_text?: string;
    category?: string;
  };
};

type SearchResponse = {
  answer: string;
  matches: SearchHit[];
};
import { Request, Response } from "express";
import * as PineconeService from "../service/pinecone.service";

export async function listSupportedModelsController(
  req: Request,
  res: Response,
) {
  try {
    const models = await PineconeService.listSupportedModels();
    res.status(200).json(models);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch supported models", details: error });
  }
}
// ...existing code...

export async function searchRecordsByText(req: Request, res: Response) {
  try {
    const { text } = req.query;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'text' query parameter" });
    }

    const result = await PineconeService.searchRecordsByText(text);

    // ✅ Handle no results
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(200).json({
        answer: "No relevant data found",
        matches: [],
      });
    }

    // ✅ Type guard
    if (!Array.isArray(result) && "answer" in result && "matches" in result) {
      let matches = Array.isArray(result.matches)
        ? result.matches.map((hit: any) => ({
            id: hit.id,
            score: hit._score,
            chunk_text:
              hit.fields && typeof hit.fields === "object"
                ? hit.fields.chunk_text
                : undefined,
            category:
              hit.fields && typeof hit.fields === "object"
                ? hit.fields.category
                : undefined,
          }))
        : [];
      // Sort by score descending and take top 1
      matches = matches.sort((a, b) => b.score - a.score).slice(0, 1);
      return res.status(200).json({
        answer: matches.length > 0 ? matches[0].chunk_text : result.answer,
        matches,
      });
    }

    // fallback
    return res.status(200).json({
      answer: "No relevant data found",
      matches: [],
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to search records", details: error });
  }
}

export async function createRecord(req: Request, res: Response) {
  try {
    const record = await PineconeService.createRecord(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to create record", details: error });
  }
}

export async function updateRecord(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const record = await PineconeService.updateRecord(id, req.body);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to update record", details: error });
  }
}

export async function deleteRecord(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await PineconeService.deleteRecord(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete record", details: error });
  }
}

export async function getRecord(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const record = await PineconeService.getRecord(id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch record", details: error });
  }
}

export async function getAllRecords(req: Request, res: Response) {
  try {
    const records = await PineconeService.getAllRecords();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records", details: error });
  }
}

export async function testLLMController(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query param 'q' is required" });
    }

    const answer = await PineconeService.testLLMResponse(q);

    return res.json({
      question: q,
      answer,
    });
  } catch (error) {
    console.error("LLM Error:", error);
    return res.status(500).json({ error: "LLM failed" });
  }
}

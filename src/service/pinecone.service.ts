// ===================== EMBEDDING MODELS LIST =====================

export async function listEmbeddingModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`,
    );
    const data = await res.json();
    // Filter for models that support embedding
    const embeddingModels = (data.models || []).filter((model: any) =>
      (model.supportedGenerationMethods || []).includes("embedContent"),
    );
    return embeddingModels;
  } catch (err) {
    console.error("Error fetching embedding models:", err);
    throw err;
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pc } from "../pinecone/pinecone-client";
import * as fs from "fs";
import * as path from "path";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const recordsPath = path.join(__dirname, "../pinecone/records.json");

// ===================== LLM =====================

export async function testLLMResponse(question: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ supported
    });

    const result = await model.generateContent(question);

    return result.response.text(); // ✅ FIXED
  } catch (err) {
    console.error("LLM Error:", err);
    throw err;
  }
}

// ===================== EMBEDDING + SEARCH =====================

export async function searchRecordsByText(text: string) {
  const INDEX_NAME = "example-index";

  const indexDesc = await pc.describeIndex(INDEX_NAME);
  const index = pc.index({ host: indexDesc.host });

  const searchResponse = await index.searchRecords({
    query: {
      inputs: { text },
      topK: 5,
    },
    rerank: {
      model: "bge-reranker-v2-m3",
      topN: 3,
      rankFields: ["chunk_text"],
    },
  });

  console.log("RAW RESPONSE:", JSON.stringify(searchResponse, null, 2));

  const hits = searchResponse?.result?.hits || [];

  if (hits.length === 0) {
    return {
      answer: "No relevant data found",
      matches: [],
    };
  }

  const context = hits
    .map((h: any) => h.fields?.chunk_text)
    .filter(Boolean)
    .join("\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(`
    Answer ONLY using the context below.
    If answer is not present, say "I don't know".

    Context:
    ${context}

    Question:
    ${text}
  `);

  return {
    answer: result.response.text(),
    matches: hits,
  };
}
// ===================== CRUD =====================

export async function createRecord(data: any) {
  const records = _readRecords();
  records.push(data);

  await _upsertToPinecone([data]);
  _writeRecords(records);

  return data;
}

export async function updateRecord(id: string, data: any) {
  const records = _readRecords();

  const idx = records.findIndex((r: any) => r.id === id);
  if (idx === -1) throw new Error("Record not found");

  records[idx] = { ...records[idx], ...data };

  await _upsertToPinecone([records[idx]]);
  _writeRecords(records);

  return records[idx];
}

export async function deleteRecord(id: string) {
  const records = _readRecords();

  const idx = records.findIndex((r: any) => r.id === id);
  if (idx === -1) throw new Error("Record not found");

  records.splice(idx, 1);
  _writeRecords(records);

  // Optional: delete from Pinecone index
  return true;
}

export async function getRecord(id: string) {
  const records = _readRecords();
  return records.find((r: any) => r.id === id) || null;
}

export async function getAllRecords() {
  return _readRecords();
}

// ===================== FILE HELPERS =====================

function _readRecords() {
  return JSON.parse(fs.readFileSync(recordsPath, "utf-8"));
}

function _writeRecords(records: any[]) {
  fs.writeFileSync(recordsPath, JSON.stringify(records, null, 2));
}

// ===================== PINECONE =====================

async function _upsertToPinecone(records: any[]) {
  const indexDesc = await pc.describeIndex("example-index");
  const index = pc.index({ host: indexDesc.host });

  await index.upsertRecords({ records });
}

export async function listSupportedModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`,
    );

    const data = await res.json();

    data.models.forEach((model: any) => {
      console.log("Model:", model.name);
      console.log("Methods:", model.supportedGenerationMethods);
      console.log("--------------------------------");
    });

    return data.models;
  } catch (err) {
    console.error("Error fetching models:", err);
    throw err;
  }
}

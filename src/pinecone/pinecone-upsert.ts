
import { pc } from "../pinecone/pinecone-client";
import * as fs from "fs";
import * as path from "path";

async function upsertRecords() {
  try {
    const recordsPath = path.join(__dirname, "records.json");
    const recordsData = fs.readFileSync(recordsPath, "utf-8");
    const records = JSON.parse(recordsData);

    const indexDesc = await pc.describeIndex("example-index");
    const index = pc.index({ host: indexDesc.host });
    await index.upsertRecords({ records });
    console.log("Records upserted successfully.");
  } catch (error) {
    console.error("Error upserting records:", error);
  }
}

upsertRecords();

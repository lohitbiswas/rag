import { pc } from "../pinecone/pinecone-client";

async function searchRecords() {
  try {
    const indexDesc = await pc.describeIndex("example-index");
    const index = pc.index({ host: indexDesc.host });
    const searchResponse = await index.searchRecords({
      query: {
        inputs: { text: "Apple corporation" },
        topK: 3,
      },
      rerank: {
        model: "bge-reranker-v2-m3",
        topN: 2,
        rankFields: ["chunk_text"],
      },
    });
    console.log("Search response (raw):", searchResponse);
    if (searchResponse?.result?.hits) {
      console.log("Search hits:");
      searchResponse.result.hits.forEach((hit: any, idx: number) => {
        console.log(`Hit #${idx + 1}:`, JSON.stringify(hit, null, 2));
      });
    } else {
      console.log("No hits found.");
    }
  } catch (error) {
    console.error("Error searching records:", error);
  }
}

searchRecords();

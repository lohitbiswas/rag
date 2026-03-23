import { pc } from "../pinecone/pinecone-client";

async function createIndex() {
  try {
    await pc.createIndexForModel({
      name: "example-index",
      cloud: "aws",
      region: "us-east-1",
      embed: {
        model: "multilingual-e5-large",
        fieldMap: { text: "chunk_text" },
      },
      waitUntilReady: true,
    });
    console.log("Index created successfully.");
  } catch (error: any) {
    if (error?.message?.includes("ALREADY_EXISTS")) {
      console.log("Index already exists.");
    } else {
      console.error("Error creating index:", error);
    }
  }
}

createIndex();

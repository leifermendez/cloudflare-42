import type {
  VectorizeIndex,
} from "@cloudflare/workers-types";
import fs from 'fs'
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";

export interface Env {
  VECTORIZE_INDEX: VectorizeIndex;
  AI: any;
}

const run = async (path: string) => {
  const text = fs.readFileSync(path, "utf-8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

};

const ingestLlama = async (ai: Env, file: File) => {
  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: ai.AI,
    modelName: "@cf/baai/bge-large-en-v1.5",
  });
  const store = new CloudflareVectorizeStore(embeddings, {
    index: ai.VECTORIZE_INDEX,
  });

  const text = await file.text();
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = (await textSplitter.createDocuments([text])).map((doc, index) => {
    return {
      ...doc,
      metadata: {
        page: index
      }
    }
  })

  // const ingested = await store.addDocuments(docs);
  const ingested = await store.addDocuments(docs);
  return { success: true, ingested }
}

export { ingestLlama }
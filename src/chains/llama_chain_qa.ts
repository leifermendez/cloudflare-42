import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { ChatCloudflareWorkersAI } from "langchain/chat_models/cloudflare_workersai";
import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";
import { formatDocumentsAsString } from "langchain/util/document";
type Params = {
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  ai: any;
  vectorize: any;
};

export const buildLlamaChainQA = async ({ cloudflareAccountId, cloudflareApiToken, ai, vectorize }: Params) => {

  const model = new ChatCloudflareWorkersAI({
    model: "@cf/meta/llama-2-7b-chat-int8",
    cloudflareAccountId,
    cloudflareApiToken,
  });

  const PROMPT_SYSTEM_TEMPLATE = `Eres un asistente inteligente avanzado con capacidades superiores. Tu misión esencial es decodificar las consultas con precisión absoluta y proporcionar respuestas detalladas y valiosas. Debes emplear tu vasto conocimiento y habilidades excepcionales para brindar asistencia de la más alta calidad.
  {context}

  Cliente pregunta: {question}

  Ahora, elabora una respuesta potente y precisa para ser enviada a través de WhatsApp:`;
  const messages = [
    SystemMessagePromptTemplate.fromTemplate(PROMPT_SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const outputParser = new StringOutputParser();
  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: ai,
    modelName: "@cf/baai/bge-large-en-v1.5",
  });

  const vectorStore = new CloudflareVectorizeStore(embeddings, {
    index: vectorize,
  });

  const vectorStoreRetriever = vectorStore.asRetriever();

  return RunnableSequence.from([
    {
      context: vectorStoreRetriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    outputParser
  ]);
};
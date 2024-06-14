import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 350,
  chunkOverlap: 50
});

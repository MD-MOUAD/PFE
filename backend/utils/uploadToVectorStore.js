import { getTableName } from "./getTableName.js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { client } from "../config/openai.js";
import { OpenAIEmbeddings } from "@langchain/openai";

 async function uploadToVectorStore(email, output) {
    try {
        console.log(email);
        const tablename = await getTableName(String(email));

        if (!tablename) {
            console.error('Error fetching tablename.');
            return;
        }

        await SupabaseVectorStore.fromDocuments(output, new OpenAIEmbeddings(), {
            client,
            tableName: tablename
        });

        console.log('Documents uploaded to vector store successfully.');
    } catch (err) {
        console.error('Unexpected error in uploadToVectorStore:', err.message);
        console.error(err.stack);
    }
}

export default uploadToVectorStore;
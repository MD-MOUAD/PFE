import { getTableName } from '../utils/getTableName.js';
import { client, llm } from '../config/openai.js';
import { TempBasic, TempAI, standaloneQuestionPrompt} from '../templates/chat.js';
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { formatConvHistory } from "../utils/formatConvHistory.js";

async function initializeChain(email, password) {
    const tablename = await getTableName(email);
    const embeddings = new OpenAIEmbeddings();
    console.log(tablename)
    const vectorStores = new SupabaseVectorStore(embeddings, {
        client,
        tableName: tablename,
        queryName: 'match_documents'
    });

    const retriever = vectorStores.asRetriever();

    function combineDocuments(docs) {
        return docs.map((doc) => doc.pageContent).join('\n\n');
    }

    const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm)
        .pipe(new StringOutputParser());

    const retrieverChain = RunnableSequence.from([
        prevResult => prevResult.standalone_question,
        retriever,
        combineDocuments
    ]);

    const answerChain = (answerPrompt) => answerPrompt
        .pipe(llm)
        .pipe(new StringOutputParser());

    const chain = (selectedOption) => {
        const answerPrompt = selectedOption === 'basic' ? TempBasic : TempAI;
        return RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_input: new RunnablePassthrough()
            },
            {
                context: retrieverChain,
                question: ({ original_input }) => original_input.question,
                conv_history: ({ original_input }) => original_input.conv_history
            },
            answerChain(answerPrompt)
        ]);
    };

    return chain;
}
const convHistory=[];

export const processInput = async (req, res) => {
    const { userInput, selectedOption, email} = req.body;
    console.log(email)
    const { question, conv_history } = userInput;
    convHistory.push({question, answer: conv_history});
    console.log(selectedOption)
    try {
        const chainPrincipale = await initializeChain(email);
        const response = await chainPrincipale(selectedOption).invoke({
            question: userInput,
            conv_history: formatConvHistory([])
        });
        res.status(200).json({ output: response });
    } catch (error) {
        console.error('Error processing input:', error);
        res.status(500).send('Error processing input');
    }
};

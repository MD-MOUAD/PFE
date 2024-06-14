import { createClient } from '@supabase/supabase-js';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseApiKey = process.env.SUPABASE_API_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
const openAIApiKey = process.env.OPENAI_API_KEY;

if (!supabaseApiKey || !supabaseUrl || !openAIApiKey) {
  throw new Error('Missing environment variables');
}

export const client = createClient(supabaseUrl, supabaseApiKey);
export const llm = new ChatOpenAI({
  apiKey: openAIApiKey,
  model: 'gpt-4o',
  temperature: 0.2,
  cache: true,
});

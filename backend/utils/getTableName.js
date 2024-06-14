// filename: utils/getTableName.js

import { Embeddings } from '@langchain/core/embeddings';
import { client } from '../config/openai.js';

export async function getTableName(email) {
    try {
        const { data: clientData } = await client
            .from('client')
            .select('id')
            .eq('email',email);

        if (!clientData || clientData.length === 0) {
            console.error('No client found with the provided email and password.');
            return null;
        }
        const clientId = clientData[0].id;
        console.log(clientId)
        return String('embeddings'+clientId);
    } catch (err) {
        console.error('Error fetching tablename:', err.message);
        return null;
    }
}

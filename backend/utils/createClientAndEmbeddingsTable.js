import { client } from '../config/openai.js';
import path from 'path';
import fs from 'fs';

export default async function createClientAndEmbeddingsTable(username, email, password) {
  try {
    // Insertion des informations du client dans la table client
    console.log('Inserting client information...');
    await client.from('client').insert([{ username, email, password }]);
    console.log('Client information inserted.');

    // Récupération de l'ID du client
    console.log('Fetching client ID...');
    const { data: clientData, error: fetchError } = await client
      .from('client')
      .select('id')
      .eq('username', username)
      .eq('email', email)
      .eq('password', password)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching client ID: ${fetchError.message}`);
    }
    console.log('Client ID fetched:', clientData.id);

    const clientId = clientData.id;

    // Création dynamique d'une table pour les embeddings pour le nouveau client
    const embeddingsTableName = `embeddings${clientId}`;
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${embeddingsTableName} (
        id bigserial PRIMARY KEY,
        content text,
        metadata jsonb,
        embedding vector(1536)
      );
    `;

    console.log(`Creating embeddings table "${embeddingsTableName}"...`);
    await client.rpc('execute_sql', { sql: createTableQuery });
    console.log(`Embeddings table "${embeddingsTableName}" created successfully.`);

  } catch (error) {
    console.error(`Error in createClientAndEmbeddingsTable: ${error.message}`);
    throw error;
  }
}

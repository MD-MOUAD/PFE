import {getTableName} from './getTableName.js'
import { client } from '../config/openai.js';

async function deleteClient(email) {
    try {
        const tableName = await getTableName(email);
        console.log(tableName);

        if (!tableName || tableName == null) {
            console.error('Table name not found, cannot proceed with deletion.');
            return;
        }

        const { data: clientData, error: clientError } = await client
            .from('client')
            .select('id')
            .eq('email', email);

        if (clientError) throw clientError;

        console.log("Client ID data retrieved:", clientData);

        if (!clientData || clientData.length === 0) {
            console.error('No client found with the provided email.');
            return;
        }

        const clientId = clientData[0].id;
        console.log(clientId)

        const deleteClientSql = `DELETE FROM client WHERE id = ${clientId}`;
        const deleteTableSql = `DROP TABLE ${tableName}`;

        console.log("Executing SQL:", deleteClientSql);
        const { error: deleteClientError } = await client.rpc('execute_sql', { sql: deleteClientSql });
        if (deleteClientError) throw deleteClientError;
        console.log("Client deleted");

        console.log("Executing SQL:", deleteTableSql);
        const { error: deleteTableError } = await client.rpc('execute_sql', { sql: deleteTableSql });
        if (deleteTableError) throw deleteTableError;
        console.log("Table deleted");
    } catch (err) {
        console.error('Error during deletion:', err.message);
    }
}

export default deleteClient;
import { client } from '../config/openai.js';
import { getTableName } from './getTableName.js';

export async function deleteDocuments(output,email) {
    const tablename = await getTableName(email);
    for (let i = 0; i < output.length; i++) {
        try {
            const { data: queryData, error: queryError } = await client
                .from(tablename)
                .select('id')
                .eq('content', output[i].pageContent);

            if (queryError) {
                // Handle the error
                console.error("Error querying database:", queryError.message);
                continue;
            }

            // Check if queryData is not empty
            if (queryData && queryData.length > 0) {
                // Store the id in a variable
                const id = queryData[0].id;

                const { data: deleteData, error: deleteError } = await client
                    .from(tablename)
                    .delete()
                    .eq('id', id);

                if (deleteError) {
                    // Handle the deletion error
                    console.error("Error deleting row:", deleteError.message);
                } else {
                    console.log("Row deleted successfully.");
                }
            } else {
                console.log("No matching id found.");
            }
        } catch (err) {
            console.error("Unexpected error:", err.message);
        }
    }
}

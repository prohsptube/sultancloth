const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb+srv://sultan:Sultan%40124@sultancloth.mongodb.net/?retryWrites=true&w=majority';

async function deleteData() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('sultancloth');
    const result = await db.collection('homepage_categories').deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} homepage categories`);
    console.log('✓ Ready for fresh data');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

deleteData();

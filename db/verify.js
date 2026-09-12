const { MongoClient } = require('mongodb'); 
async function run() { 
  const client = new MongoClient('mongodb://localhost:27017'); 
  await client.connect(); 
  const db = client.db('foodies'); 
  const res = await db.collection('users').updateMany(
    { email: 'abhishek7y2@gmail.com' }, 
    { $set: { isVerified: true } }
  ); 
  console.log('Modified:', res.modifiedCount); 
  await client.close(); 
} 
run().catch(console.dir);

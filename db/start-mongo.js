const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'foodies'
      }
    });

    console.log('MongoDB server successfully started!');
    console.log('URI:', mongod.getUri());
  } catch (err) {
    console.error('Error starting MongoMemoryServer:', err);
  }
}

start();

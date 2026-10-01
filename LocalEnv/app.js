const { MongoClient } = require('mongodb');

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

const client = new MongoClient(uri);

async function connectDatabase() {
    try {
        await client.connect();

        console.log('Conectado a MongoDB');

        const db = client.db(process.env.MONGO_DATABASE);

        return db;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
}

connectDatabase();
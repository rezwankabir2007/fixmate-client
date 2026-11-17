import { MongoClient } from "mongodb";

declare global {
  var fixmateMongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required to load services.");
  }

  let connection = globalThis.fixmateMongoClientPromise;

  if (!connection) {
    const client = new MongoClient(uri);
    connection = client.connect();
    globalThis.fixmateMongoClientPromise = connection;
  }

  try {
    const client = await connection;
    return client.db(process.env.MONGODB_DATABASE ?? "fixmate");
  } catch (error) {
    if (globalThis.fixmateMongoClientPromise === connection) {
      globalThis.fixmateMongoClientPromise = undefined;
    }
    throw error;
  }
}

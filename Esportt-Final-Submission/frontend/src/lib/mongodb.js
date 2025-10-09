import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  maxConnecting: 2,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env or .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export the connectToDatabase function
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db('esport'); // Explicitly specify database name
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    console.error('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

// Export a MongoClient promise by default.
export default clientPromise;
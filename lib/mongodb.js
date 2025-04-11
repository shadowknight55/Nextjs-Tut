import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';  // For loading environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;


let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MONGODB_URI environment variable');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();
export default clientPromise;
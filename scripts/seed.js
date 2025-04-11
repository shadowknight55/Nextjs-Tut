import * as dotenv from 'dotenv';  // For loading environment variables
import { MongoClient } from 'mongodb';  // MongoDB client library

dotenv.config({ path: '.env.local' });

async function seedDatabase() {

const uri = process.env.MONGODB_URI;
console.log("URI:::", uri)

if (!uri) {
        console.error('MONGODB_URI environment variable is not set');
        console.error('Make sure you have a .env.local file with MONGODB_URI defined');
        process.exit(1);  // Exit the script with an error code
    }
    
    console.log('Connecting to MongoDB...');
    
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB successfully');
        
        const db = client.db('cozy_reads');
        const collection = db.collection('books');

        console.log('Clearing existing books collection...');
        await collection.deleteMany({});
        const books = [
            {
                title: 'The Hitchhiker\'s Guide to the Galaxy',
                author: 'Douglas Adams',
                price: 12.99,
                quantity: 10,
                createdAt: new Date()  // Current timestamp
            },
            {
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                price: 9.99,
                quantity: 5,
                createdAt: new Date()
            },
            {
                title: '1984',
                author: 'George Orwell',
                price: 11.50,
                quantity: 8,
                createdAt: new Date()
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 10.99,
                quantity: 12,
                createdAt: new Date()
            },
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                price: 8.99,
                quantity: 7,
                createdAt: new Date()
            }
        ];
        console.log(`Inserting ${books.length} books...`);
        const result = await collection.insertMany(books);
        console.log(`${result.insertedCount} books inserted successfully!`);
        console.log('Creating indexes...');
        await collection.createIndex({ title: 1 });  // Index on title field
        await collection.createIndex({ author: 1 }); // Index on author field

        console.log('Database seeded successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

seedDatabase()
    .then(() => process.exit(0))    // Exit successfully
    .catch(err => {
        console.error('Unhandled error in seed script:', err);
        process.exit(1);            // Exit with error
    });
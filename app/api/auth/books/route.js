import clientPromise from '@/lib/mongodb';  // Our MongoDB connection
import { NextResponse } from 'next/server';  // Next.js response helper

export async function GET() {

    console.log("CLINETPROMISE::", clientPromise)

    try {
        const client = await clientPromise;
        const db = client.db('cozy_reads');
        const books = await db.collection('books').find({}).toArray();
        
        return NextResponse.json(
            books.map(book => ({ 
                ...book, 
                _id: book._id.toString() 
            }))
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db('cozy_reads');
        const result = await db.collection('books').insertOne(body);
        
        return NextResponse.json({ 
            message: 'Book added!', 
            id: result.insertedId 
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to add book' },
            { status: 500 }
        );
    }
}
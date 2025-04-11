import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json(); 
        const client = await clientPromise;
        const db = client.db('cozy_reads');

        await db.collection('books').updateOne(
            { _id: new ObjectId(id) },  // Find book by ID
            { $set: body }              // Update its fields
        );
        return NextResponse.json({ message: 'Book updated!' });
    } 
    catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: 'Failed to update book' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        const client = await clientPromise;
        const db = client.db('cozy_reads');
        await db.collection('books').deleteOne({ 
            _id: new ObjectId(id) 
        });
        return NextResponse.json({ message: 'Book deleted!' });

    } catch (error) {
        // If anything goes wrong, return an error response
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete book' },
            { status: 500 }
        );
    }
}
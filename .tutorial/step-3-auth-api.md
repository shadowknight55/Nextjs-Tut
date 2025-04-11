**Authentication**

1.  **Install NextAuth.js and MongoDB Adapter:**

```bash
# this should also already be installed from previous steps 
npm install next-auth @next-auth/mongodb-adapter
```

2.  **Create an authentication API route:**

Create `app/api/auth/[...nextauth]/route.js`:

```javascript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

export const authOptions = {

    adapter: MongoDBAdapter(clientPromise),
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ],
      secret: process.env.NEXTAUTH_SECRET,
  };

    const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

3.  **Create `app/api/auth/books/[id]/route.js`:**

```javascript
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
```

4.  **Create `app/api/auth/books/route.js`:**

```jsx
import clientPromise from '@/lib/mongodb';  // Our MongoDB connection
import { NextResponse } from 'next/server';  // Next.js response helper

export async function GET() {
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




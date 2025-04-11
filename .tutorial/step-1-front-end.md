**Frontend UI Structure**

We'll organize our frontend components in the `app/components` directory:

* `app/components/BookList.js`: Displays the list of books.
* `app/components/AddBookForm.js`: Form for adding new books.
* `app/components/UpdateBookForm.js`: Form for updating book details.
* `app/signin/page.js`: Sign-in page for Google OAuth

**1. BookList Component (`app/components/BookList.js`)**

```jsx
'use client';

import { useState, useEffect } from 'react';
import UpdateBookForm from './UpdateBookForm';

export default function BookList({ refreshTrigger = 0 }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/books');
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            setBooks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching books:', err);
            setError('Failed to load books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBooks();
    }, [refreshTrigger]);
 const handleEditBook = (book) => {
        setEditingBook(book);
    };
    const handleBookUpdated = () => {
        setEditingBook(null);
        fetchBooks();
    };
    const handleBookDeleted = () => {
        setEditingBook(null);
        fetchBooks();
    };
    if (loading) {
        return <div >Loading books...</div>;
    }
    if (error) {
        return <div >{error}</div>;
    }
    return (
        <div >
            <h2 >Book Inventory</h2>
            {books.length === 0 ? (
                <p >No books in inventory. Add some books to get started!</p>
            ) : (
                <ul >
                    {books.map((book) => (
                        <li key={book._id} >
                            {editingBook && editingBook._id === book._id ? (
                                <UpdateBookForm 
                                    book={{
                                        ...book, 
                                        onUpdate: handleBookUpdated,
                                        onDelete: handleBookDeleted
                                    }} 
                                />
                            ) : (
                                <div>
                                    <div >
                                        <h3 >{book.title}</h3>
                                        <button 
                                            onClick={() => handleEditBook(book)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <p> by {book.author}</p>
                                    <div >
                                        <span >${parseFloat(book.price).toFixed(2)}</span>
                                        <span >
                                            {book.quantity} in stock
                                        </span>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

**2. AddBookForm Component (`app/components/AddBookForm.js`)**

```jsx
'use client';

import { useState } from 'react';
export default function AddBookForm({ onBookAdded }) {
    const [title, setTitle] = useState('');          // Stores book title
    const [author, setAuthor] = useState('');        // Stores author name
    const [price, setPrice] = useState('');          // Stores book price
    const [quantity, setQuantity] = useState('');    // Stores inventory quantity
    const [isSubmitting, setIsSubmitting] = useState(false);  // Tracks form submission state
    const [error, setError] = useState(null);        // Stores error messages
    const [success, setSuccess] = useState(false);   // Tracks successful submissions
    const resetForm = () => {
        setTitle('');
        setAuthor('');
        setPrice('');
        setQuantity('');
        setError(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !author || !price || !quantity) {
            setError('All fields are required');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    author, 
                    price: parseFloat(price),        // Convert price to float
                    quantity: parseInt(quantity, 10)  // Convert quantity to integer
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setSuccess(true);
            resetForm();
            if (typeof onBookAdded === 'function') {
                onBookAdded();
            }
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error adding book:', err);
            setError('Failed to add book. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div >
            <h2 >Add New Book</h2>
            {error && (
                <div  role="alert">
                    <p>{error}</p>
                </div>
            )}
            {success && (
                <div  role="alert">
                    <p>Book added successfully!</p>
                </div>
            )}
            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="title" >
                        Title
                    </label>
                    <input 
                        id="title"
                        placeholder="Book title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="author" >
                        Author
                    </label>
                    <input 
                        id="author"
                        placeholder="Author name" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="price" >
                        Price ($)
                    </label>
                    <input 
                        id="price"
                        placeholder="9.99" 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="quantity" >
                        Quantity
                    </label>
                    <input 
                        id="quantity"
                        placeholder="1" 
                        type="number" 
                        min="0"
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Book'}
                </button>
            </form>
        </div>
    );
}
```

**3. UpdateBookForm Component (`app/components/UpdateBookForm.js`)**

```jsx
'use client';
import { useState } from 'react';
export default function UpdateBookForm({ book }) {
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [price, setPrice] = useState(book.price);
    const [quantity, setQuantity] = useState(book.quantity);
   const [isDeleting, setIsDeleting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`/api/books/${book._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, price, quantity }),
            });
            if (typeof book.onUpdate === 'function') {
                book.onUpdate();
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }
        setIsDeleting(true);
        try {
            await fetch(`/api/books/${book._id}`, {
                method: 'DELETE',
            });
            if (typeof book.onDelete === 'function') {
                book.onDelete();
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            setIsDeleting(false);
        }
    };
    return (
        <div >
            <h3 >Update Book</h3>
            <form onSubmit={handleSubmit} >
                <input 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <input 
                    placeholder="Author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                />
                <input 
                    placeholder="Price" 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))} 
                />
                <input 
                    placeholder="Quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))} 
                />
                <button type="submit">
                    Update Book
                </button>
            </form>
            <button 
                onClick={handleDelete} 
                
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete Book'}
            </button>
        </div>
    );
}
```

**4. Create and Add the sign-in and sign out: (`signin/page.js`):** 

```jsx
'use client';  // Marks this as a Client Component in Next.js

import { signIn } from 'next-auth/react';  // NextAuth function for authentication
import { useState } from 'react';  // React hook for state management
import { useRouter, useSearchParams } from 'next/navigation';  // Next.js routing hooks

export default function SignIn() {
    const router = useRouter();  // Hook for programmatic navigation
    const searchParams = useSearchParams();  // Hook to access URL parameters
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    const [isLoading, setIsLoading] = useState(false);  // Tracks loading state
    const [error, setError] = useState('');  // Stores error messages
    const handleGoogleSignIn = async () => {
        setIsLoading(true);  // Start loading state
        setError('');  // Clear any previous errors
        
        try {
            const result = await signIn('google', { 
                callbackUrl,  // Where to redirect after successful sign in
                redirect: false  // Prevents automatic redirect
            });
            if (result?.error) {
                setError('Failed to sign in with Google. Please try again.');
            }
            if (result?.url) {
                router.push(result.url);  // Redirect to the callback URL
            }
        } catch (err) {
            console.error('Sign in error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);  // Reset loading state
        }
    };
    return (
        <div>
            <div >
                <div >
                    <h1 >Cozy Reads</h1>
                    <h2 >Sign in to manage your inventory</h2>
                </div>
                {error && (
                    <div role="alert">
                        <p>{error}</p>
                    </div>
                )}
                <div>
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                    <div>
                        <p>
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

**5. Integrate Components into Page (`app/page.js`)**

```jsx
'use client'; // This directive tells Next.js that this is a Client-Side Component
import { useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
export default function Home() {
  const [refreshBooks, setRefreshBooks] = useState(0);
  const handleBookAdded = () => {
    setRefreshBooks(prev => prev + 1);
  };
  return (
    <main >
      <h1 >
        Cozy Reads Inventory
      </h1>
      <AddBookForm onBookAdded={handleBookAdded} />
      <BookList refreshTrigger={refreshBooks} />
    </main>
  );
}
```


**Implementation Instructions**

1.  **Create components:** Create the `BookList.js`, `AddBookForm.js`, `UpdateBookForm.js` and `signin/page.js` files in the `app/components` directory.
2.  **Integrate components:** Modify `app/page.js` to include the components.
3.  **Run the application:** Start your development server (`npm run dev`).

This will create a basic UI for managing the book inventory. We can enhance this further by adding styling, error handling, and more advanced features.


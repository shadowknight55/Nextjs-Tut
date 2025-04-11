**Styling**

For styling, we'll use Tailwind CSS, a popular utility-first CSS framework.

1.  **Install Tailwind CSS:**

```bash
# This should already be installed from previous instructions but if not you can run this command 
npm install tailwindcss @tailwindcss/postcss postcss
```

* Open `globals.css` in (`app/globals.css`) and add the Tailwind directives:

```css
@import tailwindcss
  /* Your other global styles here */
```

2.  **Apply Tailwind classes:**

Modify your components (`app/components/BookList.js`, `app/components/AddBookForm.js`, `app/components/UpdateBookForm.js`, and `app/page.js`) to use Tailwind CSS classes.

**Update: app/components/BookList.js** 

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
        return <div className="p-4">Loading books...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }
    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Book Inventory</h2>
            {books.length === 0 ? (
                <p className="text-gray-500">No books in inventory. Add some books to get started!</p>
            ) : (
                <ul className="space-y-4">
                    {books.map((book) => (
                        <li key={book._id} className="border p-4 rounded shadow-sm">
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
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-medium">{book.title}</h3>
                                        <button 
                                            onClick={() => handleEditBook(book)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-gray-700">by {book.author}</p>
                                    <div className="mt-2 flex justify-between">
                                        <span className="font-bold">${parseFloat(book.price).toFixed(2)}</span>
                                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
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

**Update: app/components/AddBookForm.js**

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
        <div className="p-4 border rounded shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p>Book added successfully!</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input 
                        id="title"
                        className="border p-2 rounded w-full" 
                        placeholder="Book title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                    </label>
                    <input 
                        id="author"
                        className="border p-2 rounded w-full" 
                        placeholder="Author name" 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                    </label>
                    <input 
                        id="price"
                        className="border p-2 rounded w-full" 
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
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <input 
                        id="quantity"
                        className="border p-2 rounded w-full" 
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
                    className={`w-full py-2 px-4 rounded font-medium ${
                        isSubmitting 
                        ? 'bg-blue-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Book'}
                </button>
            </form>
        </div>
    );
}
```

**Update app/components/UpdateBookForm.js**

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
        <div className="p-4 border rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Update Book</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="Author" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                />
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="Price" 
                    type="number" 
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value))} 
                />
                <input 
                    className="border p-2 rounded w-full" 
                    placeholder="Quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))} 
                />
                <button 
                    type="submit" 
                    className="bg-green-500 text-white p-2 rounded w-full"
                >
                    Update Book
                </button>
            </form>
            <button 
                onClick={handleDelete} 
                className="bg-red-500 text-white p-2 rounded w-full mt-2"
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete Book'}
            </button>
        </div>
    );
}
```

**Update app/signin/page.js**

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Cozy Reads</h1>
                    <h2 className="mt-2 text-lg text-gray-600">Sign in to manage your inventory</h2>
                </div>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>
                    <div className="text-sm text-center">
                        <p className="text-gray-500">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

```jsx
// app/page.js
'use client'; // This directive tells Next.js that this is a Client-Side Component
import { useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';

export default function Home() {
  const [refreshBooks, setRefreshBooks] = useState(0);
  const handleBookAdded = () => {
    setRefreshBooks(prev => prev + 1);
  };

  // --- COMPONENT RENDER ---
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cozy Reads Inventory
      </h1>
      <AddBookForm onBookAdded={handleBookAdded} />
      <BookList refreshTrigger={refreshBooks} />
    </main>
  );
}
```

**Implementation Instructions**

1.  **Install Tailwind CSS:**
    * `npm install -D tailwindcss postcss autoprefixer`

2.  **Configure Tailwind CSS:**
  * Create `postcss.config.js` add: 

```js
export default {
    plugins: {
        "@tailwindcss/postcss": {},
    }
}
```
3.  **Add Tailwind To global.css:**
    * `@import 'tailwindcss';`
4.  **Create authentication API route:**
    * Create `app/api/auth/[...nextauth]/route.js`.
5.  **Wrap layout with SessionProvider:**
    * Modify `app/layout.js`.
6.  **Add sign in and sign out:**
    * Modify `app/page.js`.


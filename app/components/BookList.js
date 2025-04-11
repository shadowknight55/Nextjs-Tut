'use client';

import { useState, useEffect } from 'react';
import UpdateBookForm from './UpdateBookForm';

export default function BookList({ refreshTrigger = 0 }) {

    console.log("BOOKLIST:::INIT")

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    
    console.log("Testing:::");

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
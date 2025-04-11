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
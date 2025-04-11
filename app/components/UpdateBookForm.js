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
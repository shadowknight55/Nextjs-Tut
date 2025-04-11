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
'use client';

import React, { lazy, Suspense } from 'react';
import UserManagement from './components/UserManagement';

export default function Home() {

  const BooksList = lazy(() => import('./components/BooksList'));

  return (
    <div className="container">
      <div className="header">
        <h1>Google Books Library</h1>
        <p>Discover amazing books from the Google Books API</p>
      </div>
      <main>
        <Suspense fallback={<div>Cargando...</div>}>
          <BooksList />
        </Suspense>
      </main>
    </div>
  );
}

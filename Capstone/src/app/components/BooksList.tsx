'use client'
import { useFetch } from "../hooks/useFetch"

interface Books {
  items: Book[]
}

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
    }
    publishedDate?: string
    publisher?: string
  }
}

var retrieved_books;

export default function BooksList() {

  const { data, loading, error } = useFetch<Books>('https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=20');

  if (error) return <p>Error: {error?.message}</p>;
  if (loading || data === null) return <p>Cargando Libros...</p>;

  console.log(data.items.length)
  retrieved_books = data.items

  return (
    <div className="container">
      {!loading && !error && retrieved_books.length === 0 && (
        <div className="loading">
          No books found.
        </div>
      )}

      {!loading && !error && retrieved_books.length > 0 && (
        <div className="books-grid">
          {retrieved_books.map((book) => (
            <div key={book.id} className="book-card">
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="book-thumbnail"
                />
              )}
              <h2 className="book-title">{book.volumeInfo.title}</h2>
              {book.volumeInfo.authors && (
                <p className="book-authors">
                  By: {book.volumeInfo.authors.join(', ')}
                </p>
              )}
              {book.volumeInfo.description && (
                <p className="book-description">
                  {book.volumeInfo.description}
                </p>
              )}
              {book.volumeInfo.publishedDate && (
                <p style={{ color: '#888', fontSize: '0.9rem' }}>
                  Published: {book.volumeInfo.publishedDate}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

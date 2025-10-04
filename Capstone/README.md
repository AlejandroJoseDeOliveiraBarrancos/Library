# Google Books App

A simple React Next.js application that fetches and displays books from the Google Books API using the useEffect hook.

## Features

- Fetches books from Google Books API on component mount
- Displays book information including title, authors, description, and thumbnail
- Responsive grid layout
- Loading and error states
- Clean, modern UI design

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd Capstone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How it Works

The app uses the `useEffect` hook to fetch books from the Google Books API when the component mounts. Here's what happens:

1. **Component Mount**: When the Home component mounts, the useEffect hook triggers
2. **API Call**: Makes a request to `https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=20`
3. **State Management**: Updates the books state with the fetched data
4. **Rendering**: Displays the books in a responsive grid layout

## API Details

The app fetches books using the Google Books API:
- **Endpoint**: `https://www.googleapis.com/books/v1/volumes`
- **Query**: Searches for "javascript" books
- **Max Results**: 20 books
- **No API Key Required**: Uses the public API endpoint

## Project Structure

```
Capstone/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout component
│       ├── page.tsx        # Main page component with useEffect
│       └── globals.css     # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks
- **TypeScript**: Type safety
- **CSS**: Custom styling with responsive design
- **Google Books API**: External API for book data

## Customization

You can easily modify the search query by changing the `q` parameter in the API URL:

```typescript
const response = await fetch(
  'https://www.googleapis.com/books/v1/volumes?q=YOUR_SEARCH_TERM&maxResults=20'
)
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

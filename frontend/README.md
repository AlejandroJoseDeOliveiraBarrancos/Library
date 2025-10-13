# Library Frontend

React TypeScript frontend for the Library Management System.

## Setup

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env

# Update .env with your Firebase credentials
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment Variables

Create a `.env` file in the frontend directory with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── Books/     # Book-related components
│   └── Layout/    # Layout components
├── contexts/      # React contexts
├── pages/         # Page components
├── services/      # API services
├── theme/         # MUI theme
├── types/         # TypeScript types
├── config/        # Configuration
├── App.tsx        # Main app component
└── main.tsx       # Entry point
```

## Features

- 🔍 Book search with filters
- 📚 Book details and information
- 💝 Wishlist management
- 📖 Loan tracking
- 🔐 Firebase authentication
- 📱 Responsive design
- 🎨 Material-UI components

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- Firebase
- Axios
- React Router


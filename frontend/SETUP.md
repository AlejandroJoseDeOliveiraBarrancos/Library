# Frontend Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages including:
- React & React DOM
- TypeScript
- Material-UI
- Firebase
- Axios
- React Router
- Vite

### 2. Configure Environment

```bash
# Copy the example environment file
cp env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
VITE_API_URL=http://localhost:8000
```

### 3. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (⚙️ icon)
4. Scroll to "Your apps" section
5. Click the web app icon (</>)
6. Copy the config values to your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 5. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Troubleshooting

### Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001,  // Change to any available port
}
```

### Firebase Auth Errors

1. Verify your Firebase config in `.env`
2. Make sure Authentication is enabled in Firebase Console
3. Enable Email/Password and Google sign-in methods
4. Check browser console for detailed error messages

### API Connection Issues

1. Make sure the backend is running on port 8000
2. Check `VITE_API_URL` in `.env`
3. Verify CORS is enabled in the backend
4. Check browser DevTools Network tab for failed requests

## Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR. Changes to React components will reflect instantly without full page reload.

### TypeScript Checking

```bash
# Check types without building
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Browser DevTools

Install these Chrome extensions:
- React Developer Tools
- Redux DevTools (if using Redux)

### VS Code Setup

Recommended extensions:
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Material Icon Theme

## Common Commands

```bash
# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Clear cache
npm cache clean --force
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` with Firebase credentials
3. ✅ Start dev server: `npm run dev`
4. 🔥 Start building features!

## Need Help?

- Check the main [README.md](../README.md)
- Review [DEVELOPMENT.md](../DEVELOPMENT.md)
- Check API docs at http://localhost:8000/docs


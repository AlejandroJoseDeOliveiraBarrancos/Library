'use client'

export default function AboutContent() {
  return (
    <div className="about-content">
      <h1>About Weather SPA</h1>
      
      <div className="about-section">
        <h2>Project Overview</h2>
        <p>
          This is a Single Page Application (SPA) built with Next.js that demonstrates 
          modern React patterns including global state management, custom hooks, lazy loading, 
          and Next.js built-in routing.
        </p>
      </div>

      <div className="about-section">
        <h2>Features Implemented</h2>
        <ul>
          <li><strong>Multi-Page Navigation:</strong> Home, About, and dynamic Forecast pages</li>
          <li><strong>Global State Management:</strong> Theme context shared across all pages</li>
          <li><strong>Custom Hooks:</strong> Reusable useFetch hook for API calls</li>
          <li><strong>Lazy Loading:</strong> About page content is loaded on demand</li>
          <li><strong>Dynamic Routing:</strong> Forecast details with URL parameters (/forecast/[city])</li>
          <li><strong>Theme Toggle:</strong> Dark/Light mode with persistent storage</li>
          <li><strong>Responsive Design:</strong> Works on all device sizes</li>
          <li><strong>TypeScript:</strong> Full type safety throughout the application</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Technical Implementation</h2>
        <ul>
          <li><strong>Next.js 14:</strong> React framework with App Router and built-in routing</li>
          <li><strong>React 18:</strong> UI library with hooks (useContext, useEffect, useState)</li>
          <li><strong>TypeScript:</strong> Type safety throughout the application</li>
          <li><strong>CSS Variables:</strong> Theme-aware styling with CSS custom properties</li>
          <li><strong>OpenWeatherMap API:</strong> External API for weather data</li>
          <li><strong>Lazy Loading:</strong> React.lazy() and Suspense for code splitting</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Key React Patterns Demonstrated</h2>
        <ul>
          <li><strong>useContext:</strong> Global theme management across components</li>
          <li><strong>Custom Hooks:</strong> Reusable useFetch hook for data fetching</li>
          <li><strong>Lazy Loading:</strong> Performance optimization with code splitting</li>
          <li><strong>Dynamic Routing:</strong> URL parameters for forecast details</li>
          <li><strong>State Management:</strong> Local and global state patterns</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>How to Use</h2>
        <ol>
          <li>Search for a city on the home page</li>
          <li>View current weather information</li>
          <li>Click "View Detailed Forecast" to see more details</li>
          <li>Toggle between light and dark themes using the dropdown</li>
          <li>Navigate between pages using the navigation menu</li>
        </ol>
      </div>
    </div>
  )
}

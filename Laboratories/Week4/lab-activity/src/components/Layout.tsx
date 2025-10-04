'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const { currentTheme, setCurrentTheme, themes } = useTheme()

  const isActive = (path: string) => pathname === path

  return (
    <div className={`app ${currentTheme.name}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <Link href="/" className="nav-brand">
              Weather SPA
            </Link>
            <p>Multi-page weather application with shared state</p>
          </div>
          
          <nav className="nav-links">
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
            
            <div className="theme-toggle">
              <select
                value={currentTheme.name}
                onChange={(e) => {
                  const theme = themes.find(t => t.name === e.target.value)
                  if (theme) setCurrentTheme(theme)
                }}
                className="theme-select"
              >
                {themes.map(theme => (
                  <option key={theme.name} value={theme.name}>
                    {theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <p>Weather data provided by OpenWeatherMap API</p>
        <p className="text-secondary">Built with Next.js, React & TypeScript</p>
      </footer>
    </div>
  )
}

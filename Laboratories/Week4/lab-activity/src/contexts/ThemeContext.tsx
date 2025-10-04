'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ITheme } from '@/types/weather'

interface ThemeContextType {
  currentTheme: ITheme
  setCurrentTheme: (theme: ITheme) => void
  themes: ITheme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes: ITheme[] = [
  {
    name: 'light',
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#f5f7fa',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e1e5e9',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  {
    name: 'dark',
    primary: '#4f46e5',
    secondary: '#7c3aed',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)'
  }
]

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ITheme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('weather-theme')
      return savedTheme ? JSON.parse(savedTheme) : themes[0]
    }
    return themes[0]
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', currentTheme.primary)
    root.style.setProperty('--secondary-color', currentTheme.secondary)
    root.style.setProperty('--background-color', currentTheme.background)
    root.style.setProperty('--surface-color', currentTheme.surface)
    root.style.setProperty('--text-color', currentTheme.text)
    root.style.setProperty('--text-secondary-color', currentTheme.textSecondary)
    root.style.setProperty('--border-color', currentTheme.border)
    root.style.setProperty('--shadow-color', currentTheme.shadow)
        
    if (typeof window !== 'undefined') {
      localStorage.setItem('weather-theme', JSON.stringify(currentTheme))
    }
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

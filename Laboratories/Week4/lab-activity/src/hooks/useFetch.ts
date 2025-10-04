'use client'

import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, isLoading, error }
}

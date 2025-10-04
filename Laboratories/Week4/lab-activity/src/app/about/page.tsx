'use client'

import { lazy, Suspense } from 'react'
import Layout from '@/components/Layout'

const AboutContent = lazy(() => import('./AboutContent'))

export default function AboutPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="loading">Loading about page...</div>}>
        <AboutContent />
      </Suspense>
    </Layout>
  )
}

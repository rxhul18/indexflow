import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Header />
        {children}
        <Footer />
    </div>
  )
}

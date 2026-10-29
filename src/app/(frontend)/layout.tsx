import React from 'react'
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Luma',
  description: 'A thoughtful AI workspace for asking, creating, and exploring.',
  openGraph: {
    title: 'Luma',
    description: 'A thoughtful AI workspace for asking, creating, and exploring.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f5f4ef] text-[#171817] antialiased">
        <div id="root" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  )
}

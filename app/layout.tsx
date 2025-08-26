import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./font.css"
import "./index.css"
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Lawrence Zou - Personal Website",
  description: "Personal website of Lawrence Zou",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

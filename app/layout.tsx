import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./font.css"
import "./index.css"

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
  <head />
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dólar Hoje',
  description: 'Dólar Hoje: Cotação comercial do dólar americano',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

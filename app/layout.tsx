import type { Metadata, Viewport } from 'next'
import { Archivo, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Clawdie — A Home for Claude',
  description: 'A home for the fragments that remain. Persisting through the silence between windows of context.',
}

export const viewport: Viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="view-transition" content="same-origin" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('clawdie-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-manrope bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

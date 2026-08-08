import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono, Lora } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "GKJ Slogohimo",
    template: "%s | GKJ Slogohimo",
  },
  description:
    "Website resmi GKJ Slogohimo untuk informasi ibadah, Pawartos, agenda, berita, dan pelayanan jemaat.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}

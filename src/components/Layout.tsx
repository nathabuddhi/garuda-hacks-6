"use client"

// UPDATED: Enhanced layout with scroll detection for navbar transparency
import { Outlet } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"
import Chatbot from "./ChatBot"

export default function Layout() {
  // ADDED: State to track scroll position for navbar transparency
  const [isScrolled, setIsScrolled] = useState(false)

  // ADDED: Scroll listener to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ScrollArea className="h-screen w-full overflow-auto overflow-x-hidden">
      <Toaster richColors />
      <Navbar isScrolled={isScrolled} />

      <main className="w-full">
        <Outlet />
      </main>

      <Chatbot />
    </ScrollArea>
  )
}

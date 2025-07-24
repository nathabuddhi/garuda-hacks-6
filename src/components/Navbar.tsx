"use client"

import { Button } from "@/components/ui/button"
import { LogoWithText } from "@/components/SmallComponents"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  isScrolled: boolean 
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/20 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <LogoWithText white={false} />

          <div className="hidden md:flex gap-4">
            <Button
              variant="ghost"
              className="text-[#525837] hover:text-[#7E8257] hover:bg-transparent" 
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="text-[#525837] border-[#525837] bg-transparent hover:bg-[#F1E6D0] hover:text-[#525837] hover:border-[#7E8257]" // UPDATED: Using new color scheme
              onClick={() => (window.location.href = "/register")}
            >
              Register
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#525837] hover:bg-transparent"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#525837]/20">
            <div className="flex flex-col gap-2 pt-4">
              <Button
                variant="ghost"
                className="text-[#525837] hover:text-[#7E8257] hover:bg-transparent justify-start"
                onClick={() => {
                  window.location.href = "/login"
                  setIsMobileMenuOpen(false)
                }}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="text-[#525837] border-[#525837] bg-transparent hover:bg-[#F1E6D0] hover:text-[#525837] hover:border-[#7E8257] justify-start"
                onClick={() => {
                  window.location.href = "/register"
                  setIsMobileMenuOpen(false)
                }}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

"use client"

// UPDATED: Enhanced navbar with proper background colors and mobile dropdown styling
import { Button } from "@/components/ui/button"
import { LogoWithText } from "@/components/SmallComponents"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { useAuthUser } from "@/lib/utils"
import { signOut } from "@/handlers/auth"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export default function Navbar() {
  const { user, loading, userProfile } = useAuthUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currPage, setCurrPage] = useState<string>("")

  useEffect(() => {
    setCurrPage(window.location.pathname)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const navigate = (path: string) => {
    window.location.href = path
  }

  if (loading) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/50 backdrop-blur-md shadow-sm`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <LogoWithText white={false} />

          <div className="hidden md:flex gap-4">
            {!user && (
              <>
                <Button
                  variant="ghost"
                  className="text-[#525837] hover:text-[#7E8257] hover:bg-transparent"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="text-[#525837] border-[#525837] bg-transparent hover:bg-[#F1E6D0] hover:text-[#525837] hover:border-[#7E8257]"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            )}
            {user && (
              <>
                <Button
                  variant="ghost"
                  className={`text-[#525837] hover:text-[#7E8257] rounded-full ${
                    currPage === "/dashboard"
                      ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                      : "hover:bg-[#7E8257]/20"
                  }`}
                  onClick={() => navigate("/dashboard")}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className={`text-[#525837] hover:text-[#7E8257] rounded-full ${
                    currPage === "/marketplace"
                      ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                      : "hover:bg-[#7E8257]/20"
                  }`}
                  onClick={() => navigate("/marketplace")}
                >
                  Marketplace
                </Button>
                <Button
                  variant="ghost"
                  className={`text-[#525837] hover:text-[#7E8257] rounded-full ${
                    currPage === "/transactions"
                      ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                      : "hover:bg-[#7E8257]/20"
                  }`}
                  onClick={() => navigate("/transactions")}
                >
                  Transactions
                </Button>
                <HoverCard openDelay={100} closeDelay={500}>
                  <HoverCardTrigger>
                    <Button
                      variant="ghost"
                      className={`text-[#525837] hover:text-[#7E8257] rounded-full ${
                        currPage === "/profile"
                          ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                          : "hover:bg-[#7E8257]/20"
                      }`}
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto">
                    <Button variant="destructive" className="bg-red-800 hover:bg-red-900" onClick={handleSignOut}>
                      Log Out
                    </Button>
                  </HoverCardContent>
                </HoverCard>
              </>
            )}
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
          <div className="md:hidden mt-4 pb-4 border-t border-[#525837]/20 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg -mx-4 px-4">
            <div className="flex flex-col gap-2 pt-4">
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    className="text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10 justify-start rounded-lg"
                    onClick={() => {
                      navigate("/login")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[#525837] border-[#525837] bg-transparent hover:bg-[#F1E6D0] hover:text-[#525837] hover:border-[#7E8257] justify-start rounded-lg"
                    onClick={() => {
                      navigate("/register")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              {user && (
                <>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-lg ${
                      currPage === "/dashboard"
                        ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                        : "text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10"
                    }`}
                    onClick={() => {
                      navigate("/dashboard")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-lg ${
                      currPage === "/marketplace"
                        ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                        : "text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10"
                    }`}
                    onClick={() => {
                      navigate("/marketplace")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Marketplace
                  </Button>
                  {userProfile?.role === "seller" && (
                    <Button
                      variant="ghost"
                      className={`justify-start rounded-lg ${
                        currPage === "/donate"
                          ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                          : "text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10"
                      }`}
                      onClick={() => {
                        navigate("/donate")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Donate
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-lg ${
                      currPage === "/transactions"
                        ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                        : "text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10"
                    }`}
                    onClick={() => {
                      navigate("/transactions")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Transactions
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-lg ${
                      currPage === "/profile"
                        ? "bg-[#7E8257] text-white hover:bg-[#525837] hover:text-white"
                        : "text-[#525837] hover:text-[#7E8257] hover:bg-[#7E8257]/10"
                    }`}
                    onClick={() => {
                      navigate("/profile")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Profile
                  </Button>

                  <div className="border-t border-[#525837]/20 my-2"></div>

                  <Button
                    variant="destructive"
                    className="bg-red-800 hover:bg-red-900 justify-start rounded-lg"
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

"use client";

import { Button } from "@/components/ui/button";
import { LogoWithText } from "@/components/SmallComponents";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthUser } from "@/lib/utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { handleSignOut } from "@/handlers/auth";

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const { user, loading, userProfile } = useAuthUser({
    redirectIfNoUser: true,
  });
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currPage, setCurrPage] = useState<string>("");

  useEffect(() => {
    setCurrPage(window.location.pathname);
  });

  if (!loading)
    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/20 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <LogoWithText white={false} />

            <div className="hidden md:flex gap-4">
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    className="text-[#525837] hover:text-[#7E8257] hover:bg-transparent"
                    onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[#525837] border-[#525837] bg-transparent hover:bg-transparent hover:text-[#525837] hover:border-[#7E8257]" // UPDATED: Using new color scheme
                    onClick={() => navigate("/register")}>
                    Register
                  </Button>
                </>
              )}
              {user && (
                <>
                  <Button
                    variant="ghost"
                    className={`text-main hover:text-main-light rounded-full  ${
                      currPage == "/dashboard"
                        ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                        : "hover:bg-main-light/70 hover:text-main-white"
                    }`}
                    onClick={() => navigate("/dashboard")}>
                    Home
                  </Button>
                  <Button
                    variant="ghost"
                    className={`text-main hover:text-main-light rounded-full  ${
                      currPage == "/marketplace"
                        ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                        : "hover:bg-main-light/70 hover:text-main-white"
                    }`}
                    onClick={() => navigate("/marketplace")}>
                    Marketplace
                  </Button>
                  {userProfile?.role === "seller" && (
                    <Button
                      variant="ghost"
                      className={`text-main hover:text-main-light rounded-full  ${
                        currPage == "/donate"
                          ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                          : "hover:bg-main-light/70 hover:text-main-white"
                      }`}
                      onClick={() => navigate("/donate")}>
                      Donate
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className={`text-main hover:text-main-light rounded-full  ${
                      currPage == "/transactions"
                        ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                        : "hover:bg-main-light/70 hover:text-main-white"
                    }`}
                    onClick={() => navigate("/transactions")}>
                    Transactions
                  </Button>
                  <HoverCard openDelay={100} closeDelay={500}>
                    <HoverCardTrigger>
                      <Button
                        variant="ghost"
                        className={`text-main hover:text-main-light rounded-full  ${
                          currPage == "/profile"
                            ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                            : "hover:bg-main-light/70 hover:text-main-white"
                        }`}
                        onClick={() => navigate("/profile")}>
                        Profile
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <Button
                        variant={"destructive"}
                        className="bg-red-800 hover:bg-red-900"
                        onClick={handleSignOut}>
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
                className="text-[#525837] hover:bg-transparent">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#525837]/20">
              <div className="flex flex-col gap-2 pt-4">
                {!user && (
                  <>
                    <Button
                      variant="ghost"
                      className="text-[#525837] hover:text-[#7E8257] hover:bg-transparent justify-start"
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}>
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      className="text-[#525837] border-[#525837] bg-transparent hover:bg-[#F1E6D0] hover:text-[#525837] hover:border-[#7E8257] justify-start"
                      onClick={() => {
                        navigate("/register");
                        setIsMobileMenuOpen(false);
                      }}>
                      Register
                    </Button>
                  </>
                )}
                {user && (
                  <>
                    <Button
                      variant="ghost"
                      className={`text-main hover:text-main-light rounded-full  ${
                        currPage == "/dashboard"
                          ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                          : "hover:bg-main-light/70 hover:text-main-white"
                      }`}
                      onClick={() => navigate("/dashboard")}>
                      Home
                    </Button>
                    <Button
                      variant="ghost"
                      className={`text-main hover:text-main-light rounded-full  ${
                        currPage == "/marketplace"
                          ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                          : "hover:bg-main-light/70 hover:text-main-white"
                      }`}
                      onClick={() => navigate("/marketplace")}>
                      Marketplace
                    </Button>
                    {userProfile?.role === "seller" && (
                      <Button
                        variant="ghost"
                        className={`text-main hover:text-main-light rounded-full  ${
                          currPage == "/donate"
                            ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                            : "hover:bg-main-light/70 hover:text-main-white"
                        }`}
                        onClick={() => navigate("/donate")}>
                        Donate
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className={`text-main hover:text-main-light rounded-full  ${
                        currPage == "/transactions"
                          ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                          : "hover:bg-main-light/70 hover:text-main-white"
                      }`}
                      onClick={() => navigate("/transactions")}>
                      Transactions
                    </Button>
                    <Button
                      variant="ghost"
                      className={`text-main hover:text-main-light rounded-full  ${
                        currPage == "/profile"
                          ? "bg-main-light text-main-white hover:bg-main-light hover:text-main-white"
                          : "hover:bg-main-light/70 hover:text-main-white"
                      }`}
                      onClick={() => navigate("/profile")}>
                      Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
}

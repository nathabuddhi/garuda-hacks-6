"use client";

import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Chatbot from "@/components/ChatBot";
import Footer from "@/components/Footer";

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollArea className="h-screen w-full overflow-auto overflow-x-hidden">
      <Toaster richColors />
      <Navbar isScrolled={isScrolled} />

      <main className="w-full">
        <Outlet />
      </main>

      <Chatbot />
      <Footer />
    </ScrollArea>
  );
}

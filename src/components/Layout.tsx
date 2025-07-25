"use client";

import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/ChatBot";
import Footer from "@/components/Footer";

export default function Layout() {

  return (
    <ScrollArea className="h-screen w-full overflow-auto overflow-x-hidden">
      <Toaster richColors />
      <Navbar />

      <main className="w-full">
        <Outlet />
      </main>

      <Chatbot />
      <Footer />
    </ScrollArea>
  );
}

"use client"

import { Button } from "@/components/ui/button"

export function Logo({ white }: { white: boolean }) {
  if (white) {
    return (
      <Button
        variant={"ghost"}
        size={"icon"}
        className="h-12 w-12 hover:bg-transparent" 
        onClick={() => (window.location.href = "/")}
      >
        <img src="/logo-white.png" alt="Logo" className="w-full h-full" />
      </Button>
    )
  }

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="h-12 w-12 hover:bg-transparent" 
      onClick={() => (window.location.href = "/")}
    >
      <img src="/logo.png" alt="Logo" className="w-full h-full" />
    </Button>
  )
}

export function LogoWithText({ white }: { white: boolean }) {
  if (white) {
    return (
      <Button
        variant={"ghost"}
        onClick={() => (window.location.href = "/")}
        className="flex items-center pl-0.5 gap-1 justify-center hover:bg-transparent" 
      >
        <img src="/logo-white.png" alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
        <span className="text-xl sm:text-2xl font-bold text-white font-cormorant">
          {" "}
          LimbahKu
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant={"ghost"}
      onClick={() => (window.location.href = "/")}
      className="flex items-center pl-0.5 gap-1 justify-center hover:bg-transparent"
    >
      <img src="/logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
      <span className="text-lg sm:text-2xl font-bold text-[#525837] font-cormorant">
        {" "}
        LimbahKu
      </span>
    </Button>
  )
}

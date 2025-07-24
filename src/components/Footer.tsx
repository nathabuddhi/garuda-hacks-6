import { LogoWithText } from "@/components/SmallComponents"

export default function Footer() {
  return (
    <footer className="bg-[#525837] border-t border-white/10 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center justify-center">
            <LogoWithText white={true} />
          </div>

          <div className="max-w-2xl">
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-sans">
              Through <span className="font-cormorant italic font-semibold">LimbahKu</span>, we empower individuals to
              manage and sell their waste responsibly. Reducing environmental impact, supporting local waste collectors,
              and paving the way for a cleaner, more sustainable future.
            </p>
          </div>

          <div className="border-t border-white/20 pt-6 w-full">
            <p className="text-white/60 text-sm font-sans">
              Copyright © 2025 <span className="font-cormorant font-semibold">LimbahKu Website</span>. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

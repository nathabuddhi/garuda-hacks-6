// UPDATED: Complete landing page redesign with new colors, fonts, and responsive design
import Footer from "@/components/Footer"
import { LogoWithText } from "@/components/SmallComponents"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuthUser } from "@/lib/utils"
import { Recycle } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function LandingPage() {
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (!loading && user) {
      window.location.href = ("/dashboard"); // redirect if logged in
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50">
      {" "}
      <div
        className="relative w-full h-screen bg-cover bg-center shadow-2xl"
        style={{ backgroundImage: "url('/home.jpg')" }}
      >
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 text-white animate-fade-in">
          <LogoWithText white={true} />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 leading-tight tracking-tight text-white font-sans">
            Turn Your <span className="italic font-cormorant font-semibold">Waste</span> into Worth
          </h1>

          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl max-w-4xl mx-auto text-white/90 mb-10 leading-relaxed font-sans">
            We believe that everyone has the power to drive change. Through{" "}
            <strong className="font-cormorant italic">LimbahKu</strong>, we empower individuals to manage and sell their
            waste responsibly. Reducing environmental impact, supporting local waste collectors, and paving the way for
            a cleaner, more sustainable future.
          </p>

          <Button
            className="font-semibold text-lg sm:text-xl py-4 px-8 bg-[#F1E6D0] hover:bg-[#E5D9C3] text-[#525837] rounded-full"
            asChild
          >
            <Link to={"/register"}>Join now</Link>
          </Button>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#525837] to-[#7E8257] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-transparent border border-white/20 rounded-xl overflow-hidden h-auto mb-8">
              <TabsTrigger
                value="about"
                className="cursor-pointer text-white text-sm sm:text-base font-medium py-3 px-2 sm:px-4 data-[state=active]:bg-[#F1E6D0] data-[state=active]:text-[#525837] transition-colors duration-200"
              >
                About Us
              </TabsTrigger>
              <TabsTrigger
                value="why"
                className="cursor-pointer text-white text-sm sm:text-base font-medium py-3 px-2 sm:px-4 data-[state=active]:bg-[#F1E6D0] data-[state=active]:text-[#525837] transition-colors duration-200"
              >
                Why LimbahKu
              </TabsTrigger>
              <TabsTrigger
                value="testimonials"
                className="cursor-pointer text-white text-sm sm:text-base font-medium py-3 px-2 sm:px-4 data-[state=active]:bg-[#F1E6D0] data-[state=active]:text-[#525837] transition-colors duration-200"
              >
                What They Say
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="cursor-pointer text-white text-sm sm:text-base font-medium py-3 px-2 sm:px-4 data-[state=active]:bg-[#F1E6D0] data-[state=active]:text-[#525837] transition-colors duration-200"
              >
                Contact Us
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-8">
              <Card className="bg-[#7E8257] border border-white/20 text-white shadow-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
                  <div className="flex items-center">
                    <img src="logo-white.png" className="w-10 text-white" />
                    <span className="text-xl font-semibold tracking-wide font-cormorant">LimbahKu</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-cormorant">About Us</h2>
                  <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                    <div className="space-y-4 sm:space-y-5 text-white/90 leading-relaxed font-sans">
                      <p>
                        At LimbahKu, we believe that waste is not the end—it's the beginning of change. Every piece of
                        discarded material holds the potential to create impact, and we're here to unlock that
                        potential.
                      </p>
                      <p>
                        LimbahKu is a platform built to help households manage, sort, and sell their waste with ease and
                        responsibility. By connecting communities with local waste collectors and recycling initiatives,
                        we aim to reduce environmental harm while supporting a more circular economy.
                      </p>
                      <p>
                        We're not just simplifying waste disposal. We're building a culture that values every effort to
                        protect the planet, empowers local changemakers, and transforms everyday habits into meaningful
                        action.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src="/waste_buyer.png"
                        alt="Community recycling"
                        className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 w-full max-w-md"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="why" className="mt-8">
              <Card className="bg-[#7E8257] border border-white/20 text-white shadow-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6 text-white/90 leading-relaxed font-sans">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-cormorant text-center">
                    Why LimbahKu ?
                  </h2>

                  <div className="space-y-6 text-center max-w-4xl mx-auto">
                    <p className="text-lg">
                      LimbahKu makes it easy for everyday households to take charge of their waste. From sorting to
                      selling, we provide a simple way to turn what's discarded into something valuable. By connecting
                      users with verified local collectors, LimbahKu strengthens grassroots recycling efforts while
                      ensuring fair opportunities for community waste workers. We believe in giving materials a second
                      life. Our platform encourages sustainable habits and helps reduce the burden of waste on our
                      environment.
                    </p>
                    <p className="text-lg">
                      Track your waste journey from pickup to processing. We prioritize transparency to build trust—
                      because every item deserves a responsible ending. Whether it's a plastic bottle or an old
                      appliance, every contribution matters. With LimbahKu, your everyday actions become part of a
                      larger movement toward a cleaner future.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials" className="mt-8">
              <Card className="bg-[#7E8257] border border-white/20 text-white shadow-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6 text-white/90 leading-relaxed font-sans">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-cormorant text-center">
                    What They Say
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white/10 p-6 rounded-lg">
                      <p className="italic mb-4">
                        "LimbahKu has transformed how our family thinks about waste. It's so easy to use and we're
                        making a real difference!"
                      </p>
                      <p className="font-semibold">- Sarah, Jakarta</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg">
                      <p className="italic mb-4">
                        "As a waste collector, LimbahKu has helped me connect with more households and grow my business
                        sustainably."
                      </p>
                      <p className="font-semibold">- Ahmad, Bandung</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-8">
              <Card className="bg-[#7E8257] border border-white/20 text-white shadow-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <Recycle className="h-6 w-6 text-white" />
                    <span className="text-xl font-semibold tracking-wide font-cormorant">LimbahKu</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-cormorant">
                      We'd love to hear from you.
                    </h2>
                    <p className="text-white/80 leading-relaxed font-sans">
                      Whether you have a question, want to collaborate, or simply wish to share your story, we're here
                      to connect.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="block mb-2 text-white font-medium font-sans">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-white/90 border border-white/30 text-[#525837] placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedback" className="block mb-2 text-white font-medium font-sans">
                        Feedback
                      </Label>
                      <Textarea
                        id="feedback"
                        className="bg-white/90 border border-white/30 text-[#525837] placeholder:text-gray-500 min-h-[120px] rounded-lg focus:ring-2 focus:ring-white focus:border-white transition-all duration-200"
                        placeholder="Share your thoughts, questions, or suggestions..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-[#F1E6D0] hover:bg-[#E5D9C3] text-[#525837] px-8 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                      >
                        Send →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Card className="bg-gradient-to-r from-[#525837] to-[#7E8257] border border-white/20 text-white shadow-2xl rounded-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <p className="text-xl sm:text-2xl font-light mb-2 tracking-tight font-sans leading-relaxed">
                Every choice we make shapes the world around us.
                <br />
                Let's take conscious steps, together.
              </p>
            </div>
            <Button
              className="bg-[#F1E6D0] hover:bg-[#E5D9C3] text-[#525837] px-8 py-3 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-xl whitespace-nowrap"
              asChild
            >
              <Link to="/register">Join us now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

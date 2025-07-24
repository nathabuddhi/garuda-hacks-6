import Footer from "@/components/Footer";
import { LogoWithText } from "@/components/SmallComponents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Recycle } from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
    return (
        <div className="bg-main-light">
            <div
                className="relative w-full h-[calc(100vh+200px)] bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: "url('/home.jpg')" }}>
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 text-main-white animate-fade-in">
                    <LogoWithText white={true} />
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white">
                        Turn Your{" "}
                        <span className="italic font-extrabold">Waste</span>{" "}
                        into Worth
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto text-white/90 mb-10 leading-relaxed">
                        We believe that everyone has the power to drive change.{" "}
                        Through <strong>LimbahKu</strong>, we empower
                        individuals to manage and sell their waste responsibly.
                        Reducing environmental impact, supporting local waste
                        collectors, and paving the way for a cleaner, more
                        sustainable future.
                    </p>
                    <Button
                        className="font-bold text-xl py-5.5"
                        variant={"secondary"}>
                        <Link to={"/register"}>Join Now</Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-main/90 border border-main-light/30 rounded-xl overflow-hidden h-auto">
                        <TabsTrigger
                            key={"about"}
                            value={"about"}
                            className="text-main-white text-sm sm:text-base font-medium py-3 px-4 data-[state=active]:bg-main-light transition-colors duration-200">
                            About Us
                        </TabsTrigger>
                        <TabsTrigger
                            key={"why"}
                            value={"why"}
                            className="text-main-white text-sm sm:text-base font-medium py-3 px-4 data-[state=active]:bg-main-light transition-colors duration-200">
                            Why LimbahKu?
                        </TabsTrigger>
                        <TabsTrigger
                            key={"contact"}
                            value={"contact"}
                            className="text-main-white text-sm sm:text-base font-medium py-3 px-4 data-[state=active]:bg-main-light transition-colors duration-200">
                            Contact Us
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-8">
                        <Card className="bg-white/5 backdrop-blur-lg border border-main-light/20 text-main-white shadow-2xl rounded-xl overflow-hidden">
                            <CardContent className="p-8 sm:p-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <Recycle className="h-6 w-6 text-main-light animate-spin-slow" />
                                    <span className="text-xl font-semibold tracking-wide">
                                        LimbahKu
                                    </span>
                                </div>
                                <h2 className="text-4xl font-extrabold tracking-tight">
                                    About Us
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-5 text-white/90 leading-relaxed">
                                        <p>
                                            At LimbahKu, we believe that waste
                                            is not the end—it's the beginning of
                                            change. Every gram of discarded
                                            material holds the potential to
                                            create impact.
                                        </p>
                                        <p>
                                            Our platform helps households
                                            manage, sort, and sell their waste
                                            with ease. We connect communities to
                                            local waste collectors to support
                                            circular economy efforts.
                                        </p>
                                        <p>
                                            We're not just simplifying waste
                                            disposal—we're building a culture of
                                            environmental responsibility and
                                            empowerment.
                                        </p>
                                    </div>
                                    <div className="flex justify-center">
                                        <img
                                            src="/placeholder.svg?height=300&width=300"
                                            alt="Community recycling"
                                            className="rounded-lg opacity-90 shadow-lg transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="why" className="mt-8">
                        <Card className="bg-white/5 backdrop-blur-lg border border-main-light/20 text-main-white shadow-2xl rounded-xl overflow-hidden">
                            <CardContent className="p-8 sm:p-10 space-y-6 text-white/90 leading-relaxed">
                                <h2 className="text-4xl font-extrabold tracking-tight">
                                    Why LimbahKu?
                                </h2>
                                <p>
                                    LimbahKu makes it easy for everyday
                                    households to take charge of their waste.
                                    From sorting to selling, we provide a simple
                                    way to turn what's discarded into something
                                    valuable. By connecting users with verified
                                    local collectors, LimbahKu strengthens
                                    grassroots recycling efforts while ensuring
                                    fair opportunities for community waste
                                    workers. We believe in giving materials a
                                    second life. Our platform encourages
                                    sustainable habits and helps reduce the
                                    burden of waste on our environment.
                                </p>
                                <p>
                                    Track your waste journey from pickup to
                                    processing. We prioritize transparency to
                                    build trust—because every item deserves a
                                    responsible ending. Whether it's a plastic
                                    bottle or an old appliance, every
                                    contribution matters. With LimbahKu, your
                                    everyday actions become part of a larger
                                    movement toward a cleaner future.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-8">
                        <Card className="bg-white/5 backdrop-blur-lg border border-main-light/20 text-main-white shadow-2xl rounded-xl overflow-hidden">
                            <CardContent className="p-8 sm:p-10 space-y-8 max-w-2xl mx-auto">
                                <h2 className="text-4xl font-extrabold tracking-tight">
                                    Contact Us
                                </h2>
                                <p className="text-white/80 leading-relaxed">
                                    Whether you have a question, want to
                                    collaborate, or just want to say hi — we'd
                                    love to hear from you.
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <Label
                                            htmlFor="email"
                                            className="block mb-2 text-main-white font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="bg-main/70 border border-main-light/30 text-main-white placeholder:text-white/50 rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light transition-all duration-200"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="feedback"
                                            className="block mb-2 text-main-white font-medium">
                                            Feedback
                                        </Label>
                                        <Textarea
                                            id="feedback"
                                            className="bg-main/70  border border-main-light/30 text-main-white placeholder:text-white/50 min-h-[140px] rounded-lg focus:ring-2 focus:ring-main-light focus:border-main-light transition-all duration-200"
                                            placeholder="Share your thoughts, questions, or suggestions..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="bg-main-light hover:bg-main text-main-white px-8 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <Card className="bg-white/5 backdrop-blur-lg border border-main-light/20 text-main-white shadow-2xl rounded-xl overflow-hidden">
                    <CardContent className="p-8 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <p className="text-xl font-semibold mb-2 tracking-tight">
                                Every choice shapes the world around us.
                                <br />
                                Let's take conscious steps, together with
                                LimbahKu.
                            </p>
                        </div>
                        <Button className="bg-main-light hover:bg-main text-main-white px-8 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                            Join us now
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}


import { Button } from "@/components/ui/button";
import { LogoWithText } from "@/components/SmallComponents";

export default function Navbar() {
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-xs">
                <div className="container mx-auto px-12 py-4 flex items-center justify-between">
                    <LogoWithText white={false} />
                    <div className="flex gap-4">
                        <Button
                            variant="ghost"
                            className="text-logo hover:text-main hover:bg-invisible">
                            Login
                        </Button>
                        <Button
                            variant="outline"
                            className="text-logo border-logo bg-invisible hover:bg-invisible hover:text-main hover:border-main">
                            Register
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    );
}

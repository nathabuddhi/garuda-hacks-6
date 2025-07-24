import { Button } from "@/components/ui/button";

export function Logo({ white }: { white: boolean }) {
    if (white) {
        return (
            <Button
                variant={"ghost"}
                size={"icon"}
                className="h-12 w-12 hover:bg-invisible"
                onClick={() => (window.location.href = "/")}>
                <img src="logo-white.png" alt="Logo" />
            </Button>
        );
    }

    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            className="h-12 w-12 hover:bg-invisible"
            onClick={() => (window.location.href = "/")}>
            <img src="logo.png" alt="Logo" />
        </Button>
    );
}

export function LogoWithText({ white }: { white: boolean }) {
    if (white) {
        return (
            <Button
                variant={"ghost"}
                onClick={() => (window.location.href = "/")}
                className="flex items-center pl-0.5 gap-0 justify-center hover:bg-invisible">
                <img src="/logo-white.png" alt="Logo" className="h-16 w-16" />
                <span className="text-2xl font-bold text-white font-cormorant">
                    LimbahKu
                </span>
            </Button>
        );
    }

    return (
        <Button
            variant={"ghost"}
            onClick={() => (window.location.href = "/")}
            className="flex items-center pl-0.5 gap-0 justify-center hover:bg-invisible">
            <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-logo font-cormorant">
                LimbahKu
            </span>
        </Button>
    );
}

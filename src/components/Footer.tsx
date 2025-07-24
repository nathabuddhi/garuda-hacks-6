import { LogoWithText } from "./SmallComponents";

export default function Footer() {
    return (
        <footer className="bg-main-light border-t border-white/10 py-6">
            <div className="container mx-auto px-4 text-center text-white/60">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <LogoWithText white={true} />
                </div>
                <p className="text-sm">
                    © 2025 LimbahKu. Turn your waste into worth.
                </p>
            </div>
        </footer>
    );
}

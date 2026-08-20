import { Github } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-page py-8 mt-auto flex items-center justify-center min-h-[200px] w-screen">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">HS-Calendar</h2>
                <a
                    href="https://github.com/Asahiska/HS-Calendar"
                    className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github size={24} />
                    <span>GitHub Repository</span>
                </a>
                <div className="text-sm text-white/70">
                    <p>Maintained by Asahiska</p>
                    <p>
                        Originally based on{" "}
                        <a
                            href="https://github.com/fwallmeier/HsOsnabrueckFilterICS"
                            className="text-white hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            FWallmeier&apos;s HsOsnabrueckFilterICS
                        </a>
                        , since heavily modified
                    </p>
                    <p>
                        © {new Date().getFullYear()}{" "}
                        <a
                            href="https://github.com/Asahiska/HS-Calendar/blob/main/LICENSE"
                            className="text-white hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GNU General Public License
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}


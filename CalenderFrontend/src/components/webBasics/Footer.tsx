import { Github } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-muted/50 py-8 mt-auto flex items-center justify-center min-h-[200px] w-screen">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-primary">HSOS Filter ICS Tool</h2>
                <a
                    href="https://github.com/fwallmeier/HsOsnabrueckFilterICS"
                    className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github size={24} />
                    <span>GitHub Repository</span>
                </a>
                <div className="text-sm text-muted-foreground">
                    <p>Created by FWallmeier</p>
                    <p>
                        © {new Date().getFullYear()}{" "}
                        <a
                            href="https://github.com/fwallmeier/HsOsnabrueckFilterICS/blob/main/LICENSE"
                            className="text-primary hover:underline"
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


import { Link } from "react-router-dom";

import { Button } from '@/components/ui/button'; // Assuming shadcn-ui is the library for components
import { Card } from '@/components/ui/card';

function Welcome() {
    var EXAMPLE_URL = import.meta.env.VITE_EXAMPLE_URL;
    return (
        <div className="relative flex m-0 p-0 flex-col items-center justify-center bg-page w-screen min-h-screen">
            <Card className="p-6 rounded-lg m-6 w-full lg:w-3/4 bg-transparent border-none shadow-none">
                <h1 className="text-3xl font-bold text-center text-white">Welcome to the ICS File Filter Tool</h1>
                <p className="mt-4 text-lg text-center text-white">Effortlessly Filter and Download Your Calendar Events.</p>
                <p className="mt-2 text-md text-center text-white/80 mb-1">You can use for example: <a href={EXAMPLE_URL} className="text-white underline hover:text-white/80">{EXAMPLE_URL}</a></p>

                <Button><Link className="text-white hover:text-white" to={"./select"} onClick={() => window.scrollTo(0, 0)}>Get Started</Link></Button>
                <p className="mt-4 text-sm text-center text-white/60">Disclaimer: The information provided by this tool is for informational purposes only and does not guarantee accuracy or completeness. This tool is not provided, endorsed, or affiliated with HS-Osnabrück. Users should verify the information independently.</p>
            </Card>
        </div>
    );
}


export default Welcome; 
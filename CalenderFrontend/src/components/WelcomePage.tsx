import { Link } from "react-router-dom";

import { Button } from '@/components/ui/button'; // Assuming shadcn-ui is the library for components
import { Card } from '@/components/ui/card';

function Welcome() {
    var EXAMPLE_URL = import.meta.env.VITE_EXAMPLE_URL;
    return (
        <div className="flex m-0 p-0 flex-col items-center justify-center bg-gray-100 w-screen min-h-screen">
            <Card className="p-6 shadow-lg rounded-lg w-1/2">
                <h1 className="text-3xl font-bold text-center text-blue-600">Welcome to the ICS File Filter Tool</h1>
                <p className="mt-4 text-lg text-center text-gray-700">Effortlessly Filter and Download Your Calendar Events.</p>
                <p className="mt-2 text-md text-center text-gray-500 mb-1">You can use for example: <a href={EXAMPLE_URL} className="text-blue-500 underline">{EXAMPLE_URL}</a></p>
                
                <Button><Link className="text-white hover:text-white" to={"./filter"} onClick={() => window.scrollTo(0, 0)}>Get Started</Link></Button>
                <p className="mt-4 text-sm text-center text-gray-400">Disclaimer: The information provided by this tool is for informational purposes only and does not guarantee accuracy or completeness. This tool is not provided, endorsed, or affiliated with HS-Osnabrück. Users should verify the information independently.</p>
            </Card>
        </div>
    );
}


export default Welcome; 
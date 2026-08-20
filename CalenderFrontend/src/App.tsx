import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from '@/components/WelcomePage'; // Assuming you have a WelcomePage component
import CourseSelector from '@/components/CourseSelector';
import EventFilterPage from '@/components/EventFilterPage';
import './App.css';
import { Toaster } from './components/ui/toaster';
import Footer from "@/components/webBasics/Footer.tsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/select" element={<CourseSelector />} />
          <Route path="/filter" element={<EventFilterPage />} />
          <Route path="/*" element={<WelcomePage/>} />
        </Routes>
          <Footer></Footer>
      </Router>
      <Toaster />
    </>
    
    
  )
}

export default App

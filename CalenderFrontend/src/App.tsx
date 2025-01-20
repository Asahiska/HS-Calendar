import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from '@/components/WelcomePage'; // Assuming you have a WelcomePage component
import EventFilterPage from '@/components/EventFilterPage';
import './App.css';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/filter" element={<EventFilterPage />} />
          <Route path="/*" element={<WelcomePage/>} />
        </Routes>
      </Router>
      <Toaster />
    </>
    
    
  )
}

export default App

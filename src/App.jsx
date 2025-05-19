import './App.css'
import RGBLogViewer from './RGBLogViewer'
import InputForm from './InputForm'
import { Routes, Route } from 'react-router-dom'; // Add useLocation
function App() {

  return (
    <>
    <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/rgblog" element={<RGBLogViewer />} />
          </Routes>
      
    </>
  )
}

export default App

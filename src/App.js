import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage2 from './pages/Homepage2';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

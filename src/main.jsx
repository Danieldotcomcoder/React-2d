import React from 'react';
import ReactDOM from 'react-dom/client';
import Comp from './components/Comp.jsx';
import Knearestneighbor from './components/Knearestneighbor.jsx';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router-dom';

const App = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Comp />} />
      <Route path="/Knn" element={<Knearestneighbor />} />
    </Routes>
  </HashRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App
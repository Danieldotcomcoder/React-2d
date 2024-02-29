import React from 'react';
import ReactDOM from 'react-dom/client';
import Comp from './components/Comp.jsx';
import Knearestneighbor from './components/Knearestneighbor.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/React-2d',
    element: <Comp />,
  },
  {
    path: '/React-2d/Knn',
    element: <Knearestneighbor />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

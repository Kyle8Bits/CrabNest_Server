import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import App from './App.jsx'
import Login from './Login.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement: <h1>Not Found</h1>,
  },

  {
    path: "/home",
    element: <App/>,
    errorElement: <h1>Not Found</h1>,
  }
]
)

  const root = createRoot(document.getElementById('root'));
  root.render(  
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
  
import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Login.tsx'

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './index.css'
import AuthProvider from './components/AuthContext.tsx';
import Signup from './Signup.tsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

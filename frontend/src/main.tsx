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
import Home from './Home.tsx';
import Recipes from './Recipes.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateRecipe } from './CreateRecipe.tsx';
import Profile from './Profile.tsx';
 
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/recipes",
    element: <Recipes />,
  },
  {
    path: "/recipes/new",
    element: <CreateRecipe />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import ChatPage from './pages/chatPage/ChatPage';
import RootLayout from './layouts/rootLayout/RootLayout';
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout';
import SignInPage from './pages/signinPage/SignInPage';
import SignUpPage from './pages/signupPage/SignUpPage';




const router = createBrowserRouter([
  {
    element:<RootLayout/>,
    children:[
      {
        path:"/",
        element:<HomePage/>
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path:'/dashboard',
            element:<DashboardPage/>
          },
          {
            path:'/dashboard/chats/:id',
            element:<ChatPage/>
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/> 
  </StrictMode>,
)

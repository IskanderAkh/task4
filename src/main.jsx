import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './components/Login.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './firebase/firebase'
import Users from './pages/Users.jsx'
const router = createBrowserRouter([
  {
    path: "/task4/",
    element: <App />,
    children: [
      {
        path: "/task4/login",
        element: <Login />
      },
      {
        path: "/task4/users",
        element: <Users />
      },
      
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <RouterProvider router={router} />

  </React.StrictMode>
)

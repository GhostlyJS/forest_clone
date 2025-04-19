import { BrowserRouter, RouterProvider } from 'react-router'
import router from './router'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SocketProvider } from './contexts/SocketContext'
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import Game from './pages/Game'
import JoinPrivate from './pages/JoinPrivate'

const routes : RouteObject[] = [
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/game/:gameId",
    element: <Game/>
  },
  {
    path: "/game/private", // /game/private?join=gameCode
    element: <JoinPrivate/> 
  }
]
const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>,
)

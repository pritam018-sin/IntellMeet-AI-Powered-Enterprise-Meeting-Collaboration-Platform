import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home.jsx'
import LobbyScreen from './screens/Lobby.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'
import RoomPage from './screens/Room.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'
import PreviewLayout from './screens/PreviewLayout.jsx'
import MeetingDetails from './pages/MeetingDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectManagement from './pages/ProjectManagement.jsx'
import Analytics from './pages/Analytics.jsx'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {


  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 text-slate-900 dark:from-black dark:via-neutral-950 dark:to-red-950 dark:text-white transition-colors duration-300">
      <Navbar />
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <SocketProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lobby" element={<LobbyScreen />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/meeting/:meetingId" element={<MeetingDetails />} />
          <Route path="/preview-layout" element={<PreviewLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </SocketProvider>
    </div>
  )
}

export default App

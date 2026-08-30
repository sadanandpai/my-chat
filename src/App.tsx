import { HashRouter, Route, Routes } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage.tsx'
import { HomePage } from './pages/HomePage.tsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:characterId" element={<ChatPage />} />
      </Routes>
    </HashRouter>
  )
}

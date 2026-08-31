import { HashRouter, Route, Routes } from "react-router-dom";
import { DocumentMeta } from "./DocumentMeta.tsx";
import { ChatPage } from "./pages/ChatPage.tsx";
import { DiscussionPage } from "./pages/DiscussionPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";

export default function App() {
  return (
    <HashRouter>
      <DocumentMeta />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discussion" element={<DiscussionPage />} />
        <Route path="/chat/:characterId" element={<ChatPage />} />
      </Routes>
    </HashRouter>
  );
}

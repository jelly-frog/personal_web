import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/Home";
import NotesPage from "@/pages/Notes";
import MutterPage from "@/pages/Mutter";
import DashboardPage from "@/pages/Dashboard";
import { LayoutGroup } from "framer-motion";

export default function App() {
  return (
    <LayoutGroup>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/mutter" element={<MutterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </LayoutGroup>
  );
}
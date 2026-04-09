import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AuthPage from "./pages/Authpage";
import StartupsPage from "./pages/StartupsPage";
import StartupDetailPage from "./pages/StartupDetailPage";
import CreateStartupPage from "./pages/CreateStartupPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import { getCurrentUser } from "./api/api";

function PrivateRoute({ children }) {
  return getCurrentUser() ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/startups" element={<StartupsPage />} />
        <Route path="/startups/create" element={
          <PrivateRoute><CreateStartupPage /></PrivateRoute>
        } />
        <Route path="/startups/:id" element={
          <PrivateRoute><StartupDetailPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
        <Route path="/favorites" element={
          <PrivateRoute><FavoritesPage /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

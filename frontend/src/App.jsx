import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import AuthPage from "./pages/Authpage";
import StartupsPage from "./pages/StartupsPage";
import StartupDetailPage from "./pages/StartupDetailPage";
import CreateStartupPage from "./pages/CreateStartupPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";

import { getCurrentUser } from "./api/api";

function PrivateRoute({ children }) {
  return getCurrentUser() ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/startups" element={<StartupsPage />} />
        <Route path="/create" element={
            <PrivateRoute><CreateStartupPage /></PrivateRoute>
          } />
        <Route path="/startups/:id" element={<StartupDetailPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { Rocket, LogOut, User, Heart, PlusCircle } from "lucide-react";
import { getCurrentUser, logout } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <div className="rounded-2xl bg-sky-400/20 p-2 text-sky-300">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">StartupHub</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/startups"
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Startups
          </Link>

          {user ? (
            <>
              {user.role === "FOUNDER" && (
                <Link 
                  to="/create"
                  className="flex items-center gap-1 rounded-2xl border border-sky-400/30 px-4 py-2 text-sm text-sky-300 transition hover:bg-sky-400/10"
                >
                  <PlusCircle className="h-4 w-4" />
                  New Startup
                </Link>
              )}
              <Link
                to="/favorites"
                className="flex items-center gap-1 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:scale-[1.03]"
            >
              Authorization
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

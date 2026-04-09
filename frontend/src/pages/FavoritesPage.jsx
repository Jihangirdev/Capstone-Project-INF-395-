import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { getMyFavorites, toggleFavorite } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STAGE_COLORS = {
  IDEA: "text-purple-300 bg-purple-400/20",
  MVP: "text-yellow-300 bg-yellow-400/20",
  GROWTH: "text-green-300 bg-green-400/20",
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const data = await getMyFavorites();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(startupId) {
    try {
      await toggleFavorite(startupId);
      setFavorites(prev => prev.filter(s => s.id !== startupId));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/20 p-3 text-sky-300">
            <Heart className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Favorite Startups</h1>
        </div>
        <p className="mt-2 text-slate-400">Startups you've saved for later.</p>

        {loading ? (
          <p className="mt-10 text-center text-slate-400">Loading...</p>
        ) : favorites.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-slate-400">No favorites yet.</p>
            <Link
              to="/startups"
              className="mt-4 inline-block rounded-2xl bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              Browse Startups
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map(startup => (
              <div
                key={startup.id}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sky-300">{startup.category}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[startup.stage]}`}>
                    {startup.stage}
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-bold">{startup.title}</h3>
                <p className="mt-3 leading-7 text-slate-300 line-clamp-3">{startup.description}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Eye className="h-3 w-3" />
                  {startup.views} views
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    to={`/startups/${startup.id}`}
                    className="flex-1 rounded-2xl border border-white/10 px-4 py-2 text-center text-sm font-medium transition hover:bg-white/10"
                  >
                    View More
                  </Link>
                  <button
                    onClick={() => handleRemove(startup.id)}
                    className="rounded-2xl border border-red-400/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

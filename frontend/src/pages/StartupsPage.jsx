import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Search } from "lucide-react";
import { getStartups } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STAGE_COLORS = {
  IDEA: "text-purple-300 bg-purple-400/20",
  MVP: "text-yellow-300 bg-yellow-400/20",
  GROWTH: "text-green-300 bg-green-400/20",
};

const CATEGORIES = ["Tech", "EcoTech", "HealthTech", "EdTech", "AgriTech", "FinTech", "Other"];
const STAGES = ["IDEA", "MVP", "GROWTH"];

export default function StartupsPage() {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchStartups();
  }, [page, category, stage, searchTerm]);

  async function fetchStartups() {
    setLoading(true);
    try {
      const data = await getStartups({
        search: searchTerm.trim() || undefined,
        category: category || undefined,
        stage: stage || undefined,
        page,
        size: 9
      });
      setStartups(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      setSearchTerm(search);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold">Startups</h1>
        <p className="mt-2 text-slate-300">Browse startup ideas and find your next opportunity.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search and press Enter..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={stage}
            onChange={(e) => { setStage(e.target.value); setPage(0); }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500 transition-colors"
          >
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          </div>
        ) : startups.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-xl text-slate-400">No startups found.</p>
            <button 
              onClick={() => {setSearch(""); setSearchTerm(""); setCategory(""); setStage("");}}
              className="mt-4 text-sky-400 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {startups.map(startup => (
              <div
                key={startup.id}
                className="flex flex-col rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sky-300">{startup.category}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[startup.stage] || "bg-slate-500/20"}`}>
                    {startup.stage}
                  </span>
                </div>
                <h3 className="mt-2 text-2xl font-bold">{startup.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-300 line-clamp-3">{startup.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="h-3 w-3" />
                  {startup.views} views · by {startup.ownerName}
                </div>
                <Link
                  to={`/startups/${startup.id}`}
                  className="mt-6 block w-full rounded-2xl border border-white/10 px-4 py-2 text-center text-sm font-medium transition hover:bg-white/10"
                >
                  View More
                </Link>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ← Prev
            </button>
            <span className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-400">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              Next →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}